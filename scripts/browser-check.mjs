import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const errors = [], records = [];
await mkdir('.artifacts', { recursive: true });
try {
    const page = await browser.newPage();
    page.on('pageerror', err => errors.push(err.message));
    const tagRequests = [];
    await page.setRequestInterception(true);
    page.on('request', req => {
        if (/googletagmanager|google-analytics|doubleclick|googleadservices/.test(req.url())) { tagRequests.push(req.url()); return req.respond({ status: 200, contentType: 'text/javascript', body: '' }); }
        return req.continue();
    });
    await page.goto(origin + '/', { waitUntil: 'networkidle2' });
    assert.equal(tagRequests.length, 0, 'No measurement tag before consent');
    await page.click('[data-choice="declined"]');
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewport({ width, height: width < 800 ? 844 : 1000 });
        for (const route of Object.keys(config.pages)) {
            const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
            assert.equal(response.status(), 200, route);
            await page.evaluate(() => document.fonts.ready);
            const state = await page.evaluate(() => ({ h1: document.querySelector('h1')?.innerText, overflow: document.documentElement.scrollWidth > innerWidth + 1, imagesBroken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src) }));
            assert.ok(state.h1, `${route}: H1 in browser`);
            assert.equal(state.overflow, false, `${width}px ${route}: horizontal overflow`);
            assert.equal(state.imagesBroken.length, 0, `${route}: broken image`);
            records.push({ route, width, ...state });
            if ([390,1440].includes(width) && ['/', '/contact/', '/renovation-investisseur-marseille/'].includes(route)) await page.screenshot({ path: `.artifacts/${route === '/' ? 'home' : route.split('/')[1]}-${width}.png`, fullPage: route !== '/' });
        }
    }
    assert.equal(tagRequests.length, 0, 'Refusal persists across pages');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.click('#menu-btn');
    assert.equal(await page.$eval('#menu-btn', n => n.getAttribute('aria-expanded')), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('#menu-btn', n => n.getAttribute('aria-expanded')), 'false');
    await page.focus('#hero-slider');
    await page.keyboard.press('Home');
    assert.equal(await page.$eval('#hero-slider', n => n.getAttribute('aria-valuenow')), '0');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.$eval('#hero-slider', n => n.getAttribute('aria-valuenow')), '5');
    await page.click('.faq summary');
    assert.equal(await page.$eval('.faq details', n => n.open), true);

    await page.goto(origin + '/merci-devis/', { waitUntil: 'domcontentloaded' });
    await page.click('.cookie-settings');
    await page.click('[data-choice="accepted"]');
    const events = () => page.evaluate(() => (window.dataLayer || []).map(x => Array.from(x)));
    assert.equal((await events()).filter(x => x[0] === 'event' && x[1] === 'generate_lead').length, 0, 'Direct thank-you visit creates no lead');

    // Local mock only. All POSTs are intercepted, never sent to Netlify.
    let successful = false, posts = 0, multipart = false;
    page.removeAllListeners('request');
    page.on('request', req => {
        if (req.method() === 'POST') {
            posts++; multipart = req.headers()['content-type']?.startsWith('multipart/form-data; boundary=');
            return req.respond({ status: successful ? 200 : 500, contentType: 'text/html', body: successful ? 'OK' : 'Error' });
        }
        if (/googletagmanager|google-analytics|doubleclick|googleadservices/.test(req.url())) return req.respond({ status: 200, contentType: 'text/javascript', body: '' });
        return req.continue();
    });
    await page.goto(origin + '/contact/', { waitUntil: 'domcontentloaded' });
    await page.type('#nom', 'Test local WEBUILD');
    await page.type('#telephone', '0600000000');
    await page.select('#type-projet', 'Rénovation d’appartement');
    await page.type('textarea', 'Test local intercepté, aucun envoi externe.');
    await page.click('.project-options summary');
    await writeFile('.artifacts/test-plan.pdf', '%PDF-1.4\nLocal test file\n%%EOF');
    await (await page.$('input[type=file]')).uploadFile('.artifacts/test-plan.pdf');
    await page.click('#devis-submit');
    await page.waitForSelector('#devis-error.is-on');
    assert.equal(await page.$eval('#devis-submit', n => n.disabled), false, 'Retry available after failure');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('wb-submitted-lead')), null);
    assert.equal(posts, 1);
    assert.equal(multipart, true, 'Upload uses multipart');
    successful = true;
    await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.click('#devis-submit')]);
    assert.ok(page.url().endsWith('/merci-devis/'));
    assert.equal((await events()).filter(x => x[0] === 'event' && x[1] === 'generate_lead').length, 1, 'Successful submission creates one lead');
    assert.equal((await events()).filter(x => x[0] === 'event' && x[1] === 'conversion').length, 1);
    assert.ok(!JSON.stringify(await events()).includes('0600000000'), 'No entered phone in analytics');
    assert.ok(!JSON.stringify(await events()).includes('Test local'), 'No entered name/message in analytics');
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal((await events()).filter(x => x[1] === 'generate_lead').length, 0, 'Reload does not duplicate lead');

    await page.goto(origin + '/contact/?utm_source=google&utm_medium=organic&utm_campaign=gbp&nom=PRIVATE_TEST', { waitUntil: 'domcontentloaded' });
    const campaignConfig = (await events()).find(x => x[0] === 'config' && x[1].startsWith('G-'))[2];
    assert.equal(campaignConfig.campaign_name, 'gbp', 'Known local campaign remains attributable');
    assert.ok(!JSON.stringify(await events()).includes('PRIVATE_TEST'), 'Free query parameters are excluded');
    await page.goto(origin + '/contact/?utm_source=PRIVATE_TEST&utm_medium=organic&utm_campaign=PRIVATE_TEST', { waitUntil: 'domcontentloaded' });
    assert.ok(!JSON.stringify(await events()).includes('PRIVATE_TEST'), 'Unknown campaign text is excluded');

    await page.setJavaScriptEnabled(false);
    await page.goto(origin + '/renovation-investisseur-marseille/', { waitUntil: 'domcontentloaded' });
    assert.ok(await page.$eval('main', el => el.textContent.includes('Travaux pour investisseurs')));
    await page.goto(origin + '/contact/', { waitUntil: 'domcontentloaded' });
    assert.equal(await page.$eval('form', el => el.method), 'post', 'Native form works without client rendering');
    assert.deepEqual(errors, [], 'No browser runtime errors');
    await writeFile('docs/geo/browser-check.json', JSON.stringify({ date: new Date().toISOString(), pagesAndViewports: records.length, widths: [320,390,768,1440], errors, verified: ['layout overflow', 'metadata/H1 render', 'image loading', 'consent/refusal', 'mobile menu/Escape', 'comparison keyboard controls', 'native FAQ', 'POST failure/retry', 'multipart attachment', 'one lead after mocked successful POST', 'direct thank-you/reload not a lead', 'no form PII in events', 'allowlisted campaign attribution without free query text', 'HTML and native form without JavaScript'], limitations: ['Form backend mocked locally; actual Netlify receipt and notification not sent or verified.', 'Not a field Core Web Vitals measurement.'], records }, null, 2) + '\n');
    console.log(`${records.length} page/viewport checks and conversion/form scenarios passed.`);
} finally { await browser.close(); }
