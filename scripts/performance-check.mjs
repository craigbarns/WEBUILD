import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const chrome = await launch({ chromePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', chromeFlags: ['--headless', '--no-first-run'], logLevel: 'silent' });
await mkdir('.artifacts', { recursive: true });
const afterOnly = process.argv.includes('--after-only');
const summary = afterOnly ? JSON.parse(await readFile('docs/geo/performance-lab.json', 'utf8')).runs.filter(run => run.name === 'before') : [];
try {
    for (const [name, url] of (afterOnly ? [['after', 'http://127.0.0.1:4173/']] : [['before', 'https://webuildmarseille.fr/'], ['after', 'http://127.0.0.1:4173/']])) {
        const result = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
        await writeFile(`.artifacts/lighthouse-${name}.json`, result.report);
        const lhr = result.lhr;
        const item = { name, url, date: lhr.fetchTime, lighthouseVersion: lhr.lighthouseVersion, formFactor: lhr.configSettings.formFactor, scores: Object.fromEntries(Object.entries(lhr.categories).map(([k,v]) => [k, v.score])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(id => [id, { value: lhr.audits[id].numericValue, unit: lhr.audits[id].numericUnit }])), failed: Object.values(lhr.audits).filter(x => x.score !== null && x.score < 1 && x.details?.type !== 'debugdata').map(x => ({ id: x.id, title: x.title, display: x.displayValue })) };
        summary.push(item); console.log(JSON.stringify(item));
    }
    await writeFile('docs/geo/performance-lab.json', JSON.stringify({ limitation: 'One mobile Lighthouse lab run per version. Production before vs localhost after: environments and analytics differ; not field CWV and not a causal speed comparison. PSI returned 429; no CrUX measurement obtained.', runs: summary }, null, 2) + '\n');
} finally { await chrome.kill(); }
