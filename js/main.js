const nav = document.getElementById('nav');
const darkHeader = document.querySelector('.hero, .page-hero');
const scrollThreshold = () => darkHeader ? Math.max(0, darkHeader.offsetHeight - 80) : 80;
const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > scrollThreshold());
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = document.getElementById('menu-btn');
const drawer = document.getElementById('drawer');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const setMenu = (open) => {
    drawer.classList.toggle('is-open', open);
    iconOpen.hidden = open;
    iconClose.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.classList.remove('is-solid');
    else onScroll();
};
menuBtn.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

document.getElementById('year').textContent = new Date().getFullYear();

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
        const current = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(current - 5); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setPos(current + 5); }
    });
};
document.querySelectorAll('.ba').forEach(bindSlider);

const hero = document.getElementById('hero-slider');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (hero && reducedMotion) {
    hero.style.setProperty('--pos', '50%');
    hero.setAttribute('aria-valuenow', '50');
} else if (hero) {
    const from = 80, to = 50, dur = 2400;
    const start = performance.now() + 350;
    const tick = (t) => {
        if (hero.classList.contains('is-used')) return;
        const k = Math.min(1, Math.max(0, (t - start) / dur));
        const e = 1 - Math.pow(1 - k, 3);
        const p = from + (to - from) * e;
        hero.style.setProperty('--pos', p + '%');
        hero.setAttribute('aria-valuenow', String(Math.round(p)));
        if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

const devisForm = document.getElementById('devis-form');
if (devisForm) {
    devisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const btn = document.getElementById('devis-submit');
        const label = document.getElementById('devis-submit-label');
        const errorBox = document.getElementById('devis-error');
        errorBox.classList.remove('is-on');
        btn.disabled = true;
        label.textContent = 'Envoi en cours…';
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(f)).toString()
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            f.style.display = 'none';
            document.getElementById('devis-success').classList.add('is-on');
        } catch (err) {
            errorBox.classList.add('is-on');
            btn.disabled = false;
            label.textContent = 'Envoyer ma demande';
        }
    });
}
