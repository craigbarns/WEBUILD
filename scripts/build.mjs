import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const output = path.join(root, 'dist');
const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT);
const sync = process.argv.includes('--write-source');
const orgId = `${config.origin}/#organization`;
const siteId = `${config.origin}/#site`;
const logoUrl = `${config.origin}/images/logo-google-ads-paysage.png`;
const assetVersions = new Map();
async function versionedAsset(url) {
  const pathname = url.split('?')[0];
  if (!assetVersions.has(pathname)) assetVersions.set(pathname, createHash('sha256').update(await readFile(path.join(root, pathname.slice(1)))).digest('hex').slice(0, 12));
  return `${pathname}?v=${assetVersions.get(pathname)}`;
}
const entity = {
  '@type': 'GeneralContractor', '@id': orgId, name: config.name,
  description: config.entityDescription, url: `${config.origin}/`,
  logo: { '@id': `${config.origin}/#logo` }, image: { '@id': `${config.origin}/#logo` },
  areaServed: { '@type': 'City', name: config.verifiedArea },
  knowsAbout: ['Rénovation d’appartement', 'Rénovation d’immeuble', 'Maçonnerie', 'Gros œuvre', 'Second œuvre', 'Travaux pour investisseurs immobiliers']
};
// Never infer legal identifiers, contact details, addresses or external profiles.
if (config.verifiedContact) Object.assign(entity, config.verifiedContact);
if (config.verifiedLegalIdentity) Object.assign(entity, config.verifiedLegalIdentity);
if (config.verifiedAddress) entity.address = { '@type': 'PostalAddress', ...config.verifiedAddress };
if (config.verifiedSameAs.length) entity.sameAs = config.verifiedSameAs;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const dir of ['images', 'css', 'js', 'fonts']) await cp(path.join(root, dir), path.join(output, dir), { recursive: true });
for (const [route, page] of Object.entries(config.pages)) {
  const file = route.endsWith('.html') ? route.slice(1) : `${route.slice(1)}index.html`;
  const $ = load(await readFile(path.join(root, file), 'utf8'));
  const canonical = config.origin + route;
  $('link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"],link[href^="/css/fonts.css"],link[rel=preload][as=font]').remove();
  $('<link>').attr({ rel: 'stylesheet', href: '/css/fonts.css' }).prependTo('head');
  for (const font of ['QGYvz_MVcBeNP4NJtEtqUYLknw.woff2', '8vIH7w4qzmVxm2BL9G78HEY.woff2']) $('<link>').attr({ rel: 'preload', href: '/fonts/' + font, as: 'font', type: 'font/woff2', crossorigin: '' }).appendTo('head');
  $('title').text(page.title);
  $('meta[name="description"],meta[name="robots"],link[rel="canonical"],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]').remove();
  const meta = (key, value, property = false) => $('<meta>').attr(property ? 'property' : 'name', key).attr('content', value).appendTo('head');
  meta('description', page.description);
  meta('robots', page.index && !preview ? 'index, follow, max-image-preview:large' : 'noindex, follow');
  $('<link>').attr({ rel: 'canonical', href: canonical }).appendTo('head');
  for (const [key, value] of Object.entries({ title: page.title, description: page.description, type: page.kind === 'article' ? 'article' : 'website', url: canonical, locale: 'fr_FR', site_name: config.name, image: logoUrl, 'image:alt': 'WEBUILD — travaux et rénovation à Marseille' })) meta(`og:${key}`, value, true);
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title: page.title, description: page.description, image: logoUrl, 'image:alt': 'Logo WEBUILD' })) meta(`twitter:${key}`, value);

  const crumbItems = [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${config.origin}/` }];
  if (page.parent) crumbItems.push({ '@type': 'ListItem', position: 2, name: page.parent === '/guides/' ? 'Guides travaux' : 'Travaux de rénovation', item: config.origin + page.parent });
  if (route !== '/') crumbItems.push({ '@type': 'ListItem', position: crumbItems.length + 1, name: $('h1').text(), item: canonical });
  if ($('.crumbs').length) {
    $('.crumbs').empty();
    for (const [i, crumb] of crumbItems.entries()) {
      const li = $('<li>');
      if (i === crumbItems.length - 1) li.attr('aria-current', 'page').text(crumb.name);
      else $('<a>').attr('href', new URL(crumb.item).pathname).text(crumb.name).appendTo(li);
      li.appendTo('.crumbs');
    }
  }
  const webPage = {
    '@type': page.kind === 'contact' ? 'ContactPage' : page.kind === 'about' ? 'AboutPage' : 'WebPage',
    '@id': `${canonical}#page`, url: canonical, name: page.title, description: page.description,
    isPartOf: { '@id': siteId }, about: { '@id': orgId }, inLanguage: 'fr-FR'
  };
  if (page.updated && $('time[datetime]').length) webPage.dateModified = page.updated;
  if (route !== '/') webPage.breadcrumb = { '@id': `${canonical}#breadcrumb` };
  const graph = [entity,
    { '@type': 'ImageObject', '@id': `${config.origin}/#logo`, contentUrl: logoUrl, url: logoUrl, caption: 'WEBUILD' },
    { '@type': 'WebSite', '@id': siteId, url: `${config.origin}/`, name: 'WEBUILD — travaux et rénovation à Marseille', publisher: { '@id': orgId }, inLanguage: 'fr-FR' },
    webPage
  ];
  if (route !== '/') graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: crumbItems });
  if (page.service) {
    webPage.mainEntity = { '@id': `${canonical}#service` };
    graph.push({ '@type': 'Service', '@id': `${canonical}#service`, name: `${page.service} à Marseille`, serviceType: page.service, description: page.description, url: canonical, provider: { '@id': orgId }, areaServed: entity.areaServed, mainEntityOfPage: { '@id': webPage['@id'] } });
  }
  if (page.kind === 'article') graph.push({ '@type': 'Article', '@id': `${canonical}#article`, headline: $('h1').text(), description: page.description, author: { '@id': orgId }, publisher: { '@id': orgId }, dateModified: page.updated, inLanguage: 'fr-FR', mainEntityOfPage: { '@id': webPage['@id'] } });
  // Human-readable FAQ stays in HTML. No FAQ rich-result claim or duplicated FAQ markup.
  $('<script type="application/ld+json">').text(JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')).appendTo('head');
  if (!$('main').length) $('body > section').wrap('<main id="contenu"></main>');
  $('script[defer]').attr('defer', '');
  $('button:not([type])').attr('type', 'button');
  $('input:not([type])').attr('type', 'text');
  $('a[href^="tel:"]').each((_, el) => {
    for (const text of $(el).contents().toArray()) if (text.type === 'text' && /\d/.test(text.data)) text.data = text.data.trim().replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, '').replaceAll(' ', '\u00a0');
  });
  $('svg').each((_, el) => {
    const svg = $(el);
    if (svg.attr('viewbox')) svg.attr('viewBox', svg.attr('viewbox')).removeAttr('viewbox');
  });
  // The previous production URLs were immutable for a year. A new content key
  // also refreshes browsers that still hold those old response headers.
  for (const el of $('link[rel=stylesheet][href^="/css/"],script[src^="/js/"]').toArray()) {
    const attr = el.name === 'script' ? 'src' : 'href';
    $(el).attr(attr, await versionedAsset($(el).attr(attr)));
  }
  const html = $.html();
  await mkdir(path.dirname(path.join(output, file)), { recursive: true });
  await writeFile(path.join(output, file), html);
  if (sync) await writeFile(path.join(root, file), html);
}

const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + Object.entries(config.pages).filter(([,p]) => p.index).map(([route,p]) => `  <url><loc>${esc(config.origin + route)}</loc>${p.updated ? `<lastmod>${p.updated}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${config.origin}/sitemap.xml\n`;
const llms = '# WEBUILD — Entreprise de travaux et rénovation à Marseille\n\n> WEBUILD réalise des travaux de rénovation d’appartements et d’immeubles, de maçonnerie, de gros œuvre et de second œuvre à Marseille pour les propriétaires et investisseurs.\n\n## Pages officielles\n\n' + Object.entries(config.pages).filter(([,p]) => p.index).map(([route,p]) => `- [${p.title}](${config.origin + route}) : ${p.description}`).join('\n') + '\n';
for (const [file, content] of Object.entries({ 'sitemap.xml': sitemap, 'robots.txt': robots, 'llms.txt': llms })) {
  await writeFile(path.join(output, file), content);
  if (sync) await writeFile(path.join(root, file), content);
}
const redirects = await readFile(path.join(root, '_redirects'), 'utf8');
const aliases = Object.keys(config.pages).filter(route => route !== '/' && route.endsWith('/')).map(route => `${route}index.html ${route} 301!`).join('\n');
await writeFile(path.join(output, '_redirects'), redirects + '\n# Generated canonical index aliases\n' + aliases + '\n');
if (preview) await writeFile(path.join(output, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log(`Built ${Object.keys(config.pages).length} static HTML pages; ${Object.values(config.pages).filter(p => p.index).length} sitemap URLs${preview ? '; preview noindex' : ''}.`);
