"""Read-only crawl of the public site; never submit forms. Requires requirements-dev.txt."""
import argparse
import hashlib
import json
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urldefrag
import requests
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser()
parser.add_argument('--origin', default='https://webuildmarseille.fr')
parser.add_argument('--output', default='docs/geo/crawl-before.json')
args = parser.parse_args()
origin = args.origin.rstrip('/')
session = requests.Session()
session.headers['User-Agent'] = 'WEBUILD-Site-Audit/1.0 (owner-authorized, read-only)'
queue = deque([origin+'/', origin+'/robots.txt', origin+'/sitemap.xml', origin+'/llms.txt', origin+'/404.html', origin+'/merci-devis/'])
seen, pages, assets = set(), [], set()
while queue and len(seen) < 80:
    url = queue.popleft()
    if url in seen:
        continue
    seen.add(url)
    try:
        r = session.get(url, timeout=25)
        record = {'url':url,'final_url':r.url,'status':r.status_code,'redirects':[[x.status_code,x.headers.get('Location')] for x in r.history], 'headers':dict(r.headers),'bytes':len(r.content),'elapsed_ms':round(r.elapsed.total_seconds()*1000),'sha256':hashlib.sha256(r.content).hexdigest()}
        if 'text/html' in r.headers.get('Content-Type',''):
            s = BeautifulSoup(r.text, 'html.parser')
            meta = lambda **kw: [x.get('content') for x in s.find_all('meta', attrs=kw)]
            record.update(title=s.title.get_text() if s.title else '',descriptions=meta(name='description'),robots=meta(name='robots'),canonical=[x.get('href') for x in s.select('link[rel=canonical]')],headings=[[x.name,x.get_text(' ',strip=True)] for x in s.select('h1,h2,h3')],images=[dict(x.attrs) for x in s.select('img')],schema=[json.loads(x.string or '{}') for x in s.select('script[type="application/ld+json"]')],forms=[{'attributes':dict(x.attrs),'fields':[dict(f.attrs) for f in x.select('input,select,textarea')]} for x in s.select('form')])
            record['links'] = [a['href'] for a in s.select('a[href]')]
            for a in record['links']:
                absolute = urldefrag(urljoin(r.url,a))[0]
                p = urlsplit(absolute)
                if p.netloc == urlsplit(origin).netloc and p.scheme in ['http','https'] and not p.query:
                    queue.append(absolute)
            for a in s.select('img[src],script[src],link[rel=stylesheet]'):
                absolute=urljoin(r.url,a.get('src') or a.get('href'))
                if urlsplit(absolute).netloc == urlsplit(origin).netloc:
                    assets.add(absolute)
            for x in s.select('script,style'):
                x.decompose()
            record['text'] = s.get_text(' ',strip=True)
        else:
            record['text'] = r.text
            if url.endswith('/sitemap.xml'):
                for loc in BeautifulSoup(r.text,'xml').select('loc'):
                    queue.append(loc.get_text())
        pages.append(record)
        print(r.status_code, url, flush=True)
    except (requests.RequestException, ValueError) as e:
        pages.append({'url':url,'error':str(e)})
asset_results=[]
for url in sorted(assets):
    try:
        r=session.get(url,timeout=25)
        asset_results.append({'url':url,'status':r.status_code,'bytes':len(r.content),'type':r.headers.get('Content-Type')})
    except requests.RequestException as e:
        asset_results.append({'url':url,'error':str(e)})
output=Path(args.output)
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(json.dumps({'date':datetime.now(timezone.utc).isoformat(),'origin':origin,'pages':pages,'assets':asset_results},ensure_ascii=False,indent=2)+'\n')
print(f'{len(pages)} URLs, {len(asset_results)} assets → {output}')
