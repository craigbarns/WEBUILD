import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { load } from 'cheerio';
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const docs = new Map();
for (const route of Object.keys(config.pages)) docs.set(route, load(await readFile('dist/' + (route.endsWith('.html') ? route.slice(1) : route.slice(1) + 'index.html'), 'utf8')));

test('all pages have unique metadata, one H1, language and consistent graphs', () => {
    const titles = new Set(), descriptions = new Set();
    for (const [route, $] of docs) {
        const page = config.pages[route];
        assert.equal($('h1').length, 1, route);
        assert.equal($('html').attr('lang'), 'fr');
        assert.equal($('main').length, 1, route);
        assert.equal($('link[rel=canonical]').length, 1);
        assert.equal($('link[rel=canonical]').attr('href'), config.origin + route);
        assert.equal($('meta[name=description]').attr('content'), page.description);
        assert.equal($('meta[property="og:url"]').attr('content'), config.origin + route);
        assert.ok(!titles.has($('title').text()), `Duplicate title: ${route}`);
        assert.ok(!descriptions.has(page.description), `Duplicate description: ${route}`);
        titles.add($('title').text()); descriptions.add(page.description);
        const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
        const ids = new Set(graph.map(n => n['@id']));
        assert.equal(ids.size, graph.length, 'No duplicate entity nodes');
        const entity = graph.find(n => n['@type'] === 'GeneralContractor');
        assert.equal(entity['@id'], config.origin + '/#organization');
        assert.equal(entity.areaServed.name, 'Marseille');
        assert.equal(entity.address, undefined, 'Address must await verification');
        assert.equal(entity.telephone, undefined, 'Contact must await verification');
        assert.equal(entity.sameAs, undefined, 'Profiles must await verification');
        assert.equal(entity.aggregateRating, undefined);
        assert.ok(!graph.some(n => n['@type'] === 'FAQPage'));
        for (const node of graph) for (const key of ['provider', 'publisher', 'author', 'isPartOf', 'about', 'mainEntity', 'mainEntityOfPage', 'breadcrumb', 'logo', 'image']) {
            if (node[key]?.['@id']) assert.ok(ids.has(node[key]['@id']), `${route} unresolved ${key}`);
        }
        if (page.service) assert.equal(graph.find(n => n['@type'] === 'Service').serviceType, page.service);
        if (page.kind === 'article') assert.equal(graph.find(n => n['@type'] === 'Article').dateModified, $('time').attr('datetime'));
    }
});

test('all internal links, fragments and referenced assets resolve', async () => {
    for (const [route, $] of docs) {
        for (const el of $('a[href],img[src],script[src],link[rel=stylesheet]').toArray()) {
            const ref = $(el).attr('href') ?? $(el).attr('src');
            if (!ref || ref.startsWith('data:')) continue;
            const url = new URL(ref, config.origin + route);
            if (url.origin !== config.origin) continue;
            const target = docs.get(url.pathname);
            if (target) {
                if (url.hash) assert.ok(target('[id]').toArray().some(n => target(n).attr('id') === decodeURIComponent(url.hash.slice(1))), `${route} broken fragment ${ref}`);
            } else assert.ok((await stat('dist' + url.pathname)).isFile(), `${route} broken asset/link ${ref}`);
        }
        for (const el of $('img').toArray()) {
            assert.notEqual($(el).attr('alt'), undefined, `${route}: missing ALT`);
            assert.ok(Number($(el).attr('width')) > 0 && Number($(el).attr('height')) > 0, `${route}: missing dimensions`);
        }
        for (const el of $('link[rel=stylesheet],script[src^="/js/"]').toArray()) assert.match($(el).attr('href') ?? $(el).attr('src'), /\?v=[a-f0-9]{12}$/);
    }
});

test('sitemap only includes canonical indexable pages and robots allows discovery', async () => {
    const xml = load(await readFile('dist/sitemap.xml', 'utf8'), { xml: true });
    const urls = xml('loc').map((_,el) => xml(el).text()).get();
    const expected = Object.entries(config.pages).filter(([,p]) => p.index).map(([route]) => config.origin + route);
    assert.deepEqual(urls.sort(), expected.sort());
    assert.equal(urls.length, new Set(urls).size);
    for (const [route, $] of docs) assert.equal($('meta[name=robots]').attr('content').startsWith('noindex'), !config.pages[route].index || ['deploy-preview','branch-deploy'].includes(process.env.CONTEXT), route);
    const robots = await readFile('dist/robots.txt', 'utf8');
    assert.match(robots, /User-agent: \*\nAllow: \//);
    assert.match(robots, /Sitemap: https:\/\/webuildmarseille.fr\/sitemap.xml/);
});

test('forms preserve Netlify detection and matching fields on both entry points', () => {
    const names = [];
    for (const route of ['/', '/contact/']) {
        const $ = docs.get(route), f = $('#devis-form');
        assert.equal(f.attr('method').toLowerCase(), 'post');
        assert.equal(f.attr('data-netlify'), 'true');
        assert.equal(f.attr('netlify-honeypot'), 'bot-field');
        assert.equal(f.attr('enctype'), 'multipart/form-data');
        assert.equal(f.find('[name=form-name]').val(), 'devis');
        assert.equal(f.attr('action'), '/merci-devis/');
        assert.equal(f.find('input[type=file]').length, 1);
        assert.equal(f.find('input[type=file]').attr('multiple'), undefined);
        names.push(f.find('[name]').map((_,el) => $(el).attr('name')).get().sort());
    }
    assert.deepEqual(names[0], names[1]);
});

test('no undocumented testimonials, project metrics or speed promises are shipped', () => {
    for (const [route, $] of docs) {
        assert.equal($('blockquote').length, 0);
        assert.doesNotMatch($('main').text(), /48\s*h|Sophie|Karim|Claire V\.|65 m²|110 m²|220 m²|\bROI\b|rendement garanti/i, route);
        assert.equal($('script[src*="googletagmanager"]').length, 0, 'Consent needed before remote tag load');
    }
});

test('only public assets ship: internal reports and tools are not deployed', async () => {
    for (const item of ['docs','scripts','site.config.json','WebuildHome.jsx','SEO-STRATEGIE.md','package.json']) {
        await assert.rejects(stat('dist/' + item), { code: 'ENOENT' });
    }
});
