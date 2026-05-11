const WHATSAPP_NUMBER  = window.WHATSAPP_NUMBER  = '557598279616';
const WHATSAPP_MESSAGE = window.WHATSAPP_MESSAGE = 'Olá! Vi o site da Ki-Delicia e gostaria de mais informações';

function buildWhatsappLink(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg || WHATSAPP_MESSAGE)}`;
}

function setupWhatsappLinks() {
  ['whatsappBtn', 'whatsappCta', 'wppFloat', 'footerWpp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = buildWhatsappLink(); el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });

  document.querySelectorAll('a[href="#whatsapp"]').forEach(el => {
    if (el.dataset.wppBound === '1') return;
    el.dataset.wppBound = '1';
    el.href   = buildWhatsappLink();
    el.target = '_blank';
    el.rel    = 'noopener noreferrer';
  });

  document.querySelectorAll('.wpp-link').forEach(el => {
    if (el.dataset.wppBound === '1') return;
    el.dataset.wppBound = '1';
    el.href   = buildWhatsappLink(el.dataset.msg || null);
    el.target = '_blank';
    el.rel    = 'noopener noreferrer';
  });
}

function setupMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const drawer   = document.getElementById('navDrawer');
  const overlay  = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('navDrawerClose');

  if (!toggle || !drawer || !overlay) return;
  if (toggle.dataset.navBound === '1') return;
  toggle.dataset.navBound = '1';

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    requestAnimationFrame(() => overlay.classList.add('open'));
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    overlay.addEventListener('transitionend', () => overlay.classList.remove('visible'), { once: true });
  }

  toggle.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('[data-drawer-link]').forEach(link => {
    link.addEventListener('click', (ev) => {
      const href = link.getAttribute('href');
      closeDrawer();
      if (href && !href.startsWith('#')) {
        ev.preventDefault();
        setTimeout(() => { window.location.href = href; }, 320);
      }
    });
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}

function setupActiveNavLink() {
  const allLinks = document.querySelectorAll('.nav__link, .nav-drawer__item');
  if (!allLinks.length) return;

  const file    = window.location.pathname.split('/').pop();
  const current = file === '' ? 'index.html' : file;

  allLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) { a.classList.remove('active'); return; }
    href.split('/').pop() === current
      ? a.classList.add('active')
      : a.classList.remove('active');
  });
}

function setupScrollReveal() {
  const targets = document.querySelectorAll('.highlight-card, .product-card, .reseller__text, .hero__text');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

const _fetchCache = {};

function includeComponents() {
  document.querySelectorAll('[data-include]').forEach(target => {
    const name     = target.getAttribute('data-include');
    const tplName  = target.getAttribute('data-template') || name;
    if (!name) return;

    const load = (html) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const tpl = wrap.querySelector(`#${tplName}-template`);
      if (!tpl) return;
      target.appendChild(tpl.content.cloneNode(true));
      setupWhatsappLinks();
      setupMobileNav();
      setupActiveNavLink();
      if (typeof setupBalde === 'function') setupBalde();
    };

    if (_fetchCache[name]) {
      _fetchCache[name].then(load);
      return;
    }

    _fetchCache[name] = fetch(`components/${name}.html`)
      .then(r => r.text())
      .catch(() => '');

    _fetchCache[name].then(load);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  includeComponents();
  setupWhatsappLinks();
  setupScrollReveal();
});