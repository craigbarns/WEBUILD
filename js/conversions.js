/*
 * Suivi des conversions Google Ads — WEBUILD Marseille
 *
 * ► À RENSEIGNER : les trois libellés ci-dessous.
 *   Google Ads > Objectifs > Conversions > [action] > Configuration de la balise
 *   > « Installer la balise vous-même ». L'extrait affiché contient :
 *        send_to: 'AW-18429932319/AbC-D_efG-h12_34-567'
 *                                  ^^^^^^^^^^^^^^^^^^^^ c'est ce libellé-là.
 *
 *   Tant qu'un libellé est vide, la conversion correspondante ne se déclenche
 *   pas (aucune erreur, aucune remontée parasite dans Google Ads).
 */
// ⚠ /js/* est servi en cache immutable un an (netlify.toml) : penser à incrémenter
// le ?v= des balises <script src="/js/conversions.js?v=N"> à chaque modification.
const ADS_ID = 'AW-18429932319';

const LABELS = {
    formulaire: '', // action « Devis - Formulaire »  → page /merci-devis/
    telephone:  '', // action « Devis - Appel tel »   → clic sur un lien tel:
    whatsapp:   ''  // action « Devis - WhatsApp »    → clic sur un lien wa.me
};

const fired = new Set();

const track = (key, dedupeKey) => {
    const label = LABELS[key];
    if (!label) return;
    if (dedupeKey) {
        if (fired.has(dedupeKey)) return;
        fired.add(dedupeKey);
    }
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', { send_to: ADS_ID + '/' + label });
};

// Formulaire de devis : l'arrivée sur la page de confirmation vaut lead.
// sessionStorage évite de recompter si le prospect rafraîchit la page.
const path = window.location.pathname.replace(/\/(index\.html)?\/*$/, '');
if (path === '/merci-devis') {
    let deja = false;
    try { deja = sessionStorage.getItem('wb-conv-devis') === '1'; } catch (e) { /* mode privé */ }
    if (!deja) {
        track('formulaire');
        try { sessionStorage.setItem('wb-conv-devis', '1'); } catch (e) { /* mode privé */ }
    }
}

// Appels et WhatsApp : les liens sont présents dans le hero, la nav, le dock
// mobile, le bouton flottant et le pied de page — d'où la délégation.
document.addEventListener('click', (e) => {
    const lien = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!lien) return;
    const href = lien.getAttribute('href') || '';
    if (href.startsWith('tel:')) track('telephone', 'tel');
    else if (href.includes('wa.me')) track('whatsapp', 'wa');
});
