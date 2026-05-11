document.addEventListener('click', (e) => {
  const card = e.target.closest('.prod-card');
  if (!card) return;

  const targetId = card.dataset.target;
  if (!targetId) return;

  const panel   = document.getElementById(targetId);
  const isOpen  = card.getAttribute('aria-expanded') === 'true';

  document.querySelectorAll('.prod-card').forEach(c => {
    c.setAttribute('aria-expanded', 'false');
    const p = document.getElementById(c.dataset.target);
    if (p) p.classList.remove('open');
  });

  if (!isOpen && panel) {
    card.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }
});