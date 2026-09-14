const nav = document.getElementById('nav');
const darkHeader = document.querySelector('.hero, .page-hero');
const scrollThreshold = () => darkHeader ? Math.max(0, darkHeader.offsetHeight - 80) : 80;
const onScroll = () => nav?.classList.toggle('is-solid', window.scrollY > scrollThreshold());
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = document.getElementById('menu-btn');
const drawer = document.getElementById('drawer');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const setMenu = (open) => {
    if (!drawer || !menuBtn) return;
    drawer.classList.toggle('is-open', open);
    iconOpen.hidden = open;
    iconClose.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
        nav?.classList.remove('is-solid');
        document.querySelectorAll('main, footer, .dock, .wa').forEach(el => el.setAttribute('inert', ''));
        drawer.querySelector('a')?.focus();
    } else {
        onScroll();
        document.querySelectorAll('main[inert], footer[inert], .dock[inert], .wa[inert]').forEach(el => el.removeAttribute('inert'));
    }
};
menuBtn?.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
    if (!drawer?.classList.contains('is-open')) return;
    if (event.key === 'Escape') { setMenu(false); menuBtn.focus(); }
    if (event.key === 'Tab') {
        const items = [menuBtn, ...drawer.querySelectorAll('a[href]')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
});
window.matchMedia('(min-width: 900px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const mentions = document.getElementById('mentions');
if (mentions) {
    document.getElementById('mentions-btn').addEventListener('click', () => mentions.showModal());
    document.getElementById('mentions-close').addEventListener('click', () => mentions.close());
}

const bindSlider = (slider) => {
    const setPos = (pct) => {
        pct = Math.min(100, Math.max(0, pct));
        slider.style.setProperty('--pos', pct + '%');
        slider.setAttribute('aria-valuenow', String(Math.round(pct)));
    };
    const setPosFromX = (clientX) => {
        const r = slider.getBoundingClientRect();
        setPos((clientX - r.left) / r.width * 100);
    };
    slider.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        slider.classList.add('is-used');
        slider.setPointerCapture(e.pointerId);
        setPosFromX(e.clientX);
        const move = (ev) => setPosFromX(ev.clientX);
        slider.addEventListener('pointermove', move);
        const stop = () => slider.removeEventListener('pointermove', move);
        slider.addEventListener('pointerup', stop, { once: true });
        slider.addEventListener('pointercancel', stop, { once: true });
    });
    slider.addEventListener('keydown', (e) => {
        const parsed = parseFloat(getComputedStyle(slider).getPropertyValue('--pos'));
        const current = Number.isFinite(parsed) ? parsed : 50;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) slider.classList.add('is-used');
        if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(current - 5); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setPos(current + 5); }
        if (e.key === 'Home') { e.preventDefault(); setPos(0); }
        if (e.key === 'End') { e.preventDefault(); setPos(100); }
    });
};
document.querySelectorAll('.ba').forEach(bindSlider);

// Comparison remains interactive. Avoid unsolicited animation delaying stable paint.

const devisForm = document.getElementById('devis-form');
if (devisForm) {
    devisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        if (f.dataset.submitting === 'true') return;
        if (!f.reportValidity()) return;
        const btn = document.getElementById('devis-submit');
        const label = document.getElementById('devis-submit-label');
        const errorBox = document.getElementById('devis-error');
        errorBox.classList.remove('is-on');
        const file = f.elements.document?.files?.[0];
        if (file && (file.size > 7_000_000 || !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type))) {
            errorBox.textContent = 'Ajoutez un fichier JPG, PNG ou PDF de 7 Mo maximum, ou utilisez WhatsApp pour transmettre vos photos.';
            errorBox.classList.add('is-on');
            errorBox.focus();
            return;
        }
        f.dataset.submitting = 'true';
        btn.disabled = true;
        label.textContent = 'Envoi en cours…';
        try {
            const res = await fetch('/', {
                method: 'POST',
                // Let the browser set the multipart boundary; preserve file bytes.
                body: new FormData(f)
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            try {
                sessionStorage.setItem('wb-submitted-lead', JSON.stringify({ at: Date.now(), page: location.pathname }));
            } catch { /* Tracking is optional; the successful request still redirects. */ }
            window.location.href = '/merci-devis/';
        } catch (err) {
            errorBox.textContent = 'L’envoi a échoué. Votre demande n’a pas été confirmée. Réessayez ou appelez le 07 66 01 88 26.';
            errorBox.classList.add('is-on');
            errorBox.focus();
            f.dataset.submitting = 'false';
            btn.disabled = false;
            label.textContent = 'Envoyer ma demande';
        }
    });
}
