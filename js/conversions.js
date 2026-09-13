/* Optional analytics. Google tags only load after consent. Contact clicks are
 * intent signals; only a successful form POST is a lead. Never track form values.
 */
(() => {
    const GA_ID = 'G-ZP6SB36ECH';
    const ADS_ID = 'AW-18429932319';
    const LABELS = { formulaire: 'zp-6CMuoovAcEJ_midRE', telephone: 'zh7BCOm6j_YcEJ_midRE', whatsapp: '' };
    const KEY = 'wb-measurement-consent-v1';
    const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
    let consent = null;
    try {
        const saved = JSON.parse(localStorage.getItem(KEY));
        if (saved && Date.now() - saved.at < MAX_AGE && ['accepted', 'declined'].includes(saved.value)) consent = saved.value;
    } catch { /* The site works when storage is unavailable. */ }
    let enabled = false;
    const dedupe = new Set();
    const cleanPage = location.origin + location.pathname;
    // Only campaign codes controlled by WEBUILD enter analytics; free URL text
    // (including names, messages and arbitrary campaign parameters) is omitted.
    const params = new URLSearchParams(location.search);
    const campaign = {};
    const allowedCampaigns = { gbp: 'google', bing_places: 'bing', apple_maps: 'apple', pagesjaunes: 'pagesjaunes' };
    const campaignName = params.get('utm_campaign');
    if (Object.hasOwn(allowedCampaigns, campaignName) && params.get('utm_source') === allowedCampaigns[campaignName] && params.get('utm_medium') === 'organic') {
        Object.assign(campaign, { campaign_source: allowedCampaigns[campaignName], campaign_medium: 'organic', campaign_name: campaignName });
    }
    let referrer = '';
    try { if (document.referrer) referrer = new URL(document.referrer).origin + '/'; } catch { /* Invalid referrer. */ }
    const enable = () => {
        if (enabled || consent !== 'accepted') return;
        enabled = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'denied', ad_personalization: 'denied' });
        window.gtag('js', new Date());
        const options = { send_page_view: false, page_location: cleanPage, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false, ...campaign };
        window.gtag('config', GA_ID, options);
        window.gtag('config', ADS_ID, options);
        window.gtag('event', 'page_view', { page_location: cleanPage, page_referrer: referrer, page_title: document.title, send_to: GA_ID });
        const tag = document.createElement('script');
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        tag.async = true;
        document.head.append(tag);
    };
    const event = (name, extra = {}) => {
        if (consent !== 'accepted' || !enabled) return;
        window.gtag('event', name, { page_location: cleanPage, page_referrer: referrer, send_to: GA_ID, ...extra });
    };
    const ads = key => {
        if (consent !== 'accepted' || !enabled || !LABELS[key]) return;
        window.gtag('event', 'conversion', { send_to: ADS_ID + '/' + LABELS[key], page_location: cleanPage, page_referrer: referrer });
    };
    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Choix de mesure d’audience et de publicité');
    banner.innerHTML = '<p>Autoriser Google Analytics et Google Ads à mesurer les visites et les actions sur le site ? Votre demande de travaux reste possible sans ces outils. <a href="/confidentialite/">En savoir plus</a>.</p><div class="cookie-actions"><button class="btn btn-ink" type="button" data-choice="declined">Refuser</button><button class="btn btn-ink" type="button" data-choice="accepted">Accepter</button></div>';
    banner.hidden = consent !== null;
    document.body.append(banner);
    if (!document.querySelector('.cookie-settings')) {
        const settings = document.createElement('button');
        settings.type = 'button'; settings.className = 'cookie-settings'; settings.textContent = 'Gestion des cookies';
        document.body.append(settings);
    }
    banner.addEventListener('click', e => {
        const button = e.target.closest('[data-choice]');
        if (!button) return;
        consent = button.dataset.choice;
        try { localStorage.setItem(KEY, JSON.stringify({ value: consent, at: Date.now() })); } catch { /* Session-only choice. */ }
        banner.hidden = true;
        if (consent === 'accepted') enable();
        else if (enabled) {
            window['ga-disable-' + GA_ID] = true;
            window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
            location.reload();
        }
    });
    document.querySelectorAll('.cookie-settings').forEach(button => button.addEventListener('click', () => {
        banner.hidden = false;
        banner.querySelector('button').focus();
    }));
    enable();
    document.addEventListener('click', e => {
        const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
        if (!link || consent !== 'accepted') return;
        const href = link.getAttribute('href') || '';
        let type;
        if (href.startsWith('tel:')) type = 'telephone';
        else if (/^https:\/\/wa\.me\//.test(href)) type = 'whatsapp';
        else if (href.startsWith('mailto:')) type = 'email';
        if (!type || dedupe.has(type)) return;
        dedupe.add(type);
        event('contact_click', { contact_method: type });
        if (type !== 'email') ads(type);
    });
    if (location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') === '/merci-devis') {
        try {
            const submitted = JSON.parse(sessionStorage.getItem('wb-submitted-lead'));
            sessionStorage.removeItem('wb-submitted-lead');
            if (submitted && Date.now() - submitted.at >= 0 && Date.now() - submitted.at < 5 * 60 * 1000 && ['/', '/contact/'].includes(submitted.page)) {
                event('generate_lead', { form_name: 'devis', source_page: submitted.page });
                ads('formulaire');
            }
        } catch { /* Netlify remains the source of truth for received leads. */ }
    }
})();
