function setupBalde() {
  const baldeGrid = document.getElementById('baldeGrid');
  const pedirBtn  = document.getElementById('baldePedir');
  const slots     = [1, 2, 3].map(n => document.getElementById(`slot${n}`)?.querySelector('.slot__nome'));

  if (!baldeGrid || !pedirBtn || slots.some(s => !s)) return;
  if (baldeGrid.dataset.baldeBound === '1') return;
  baldeGrid.dataset.baldeBound = '1';

  let saboresSelecionados = [];

  function atualizarResumo() {
    slots.forEach(slot => { slot.textContent = '—'; });
    saboresSelecionados.forEach((nome, i) => { slots[i].textContent = nome; });

    const temSabor = saboresSelecionados.length >= 1;
    pedirBtn.disabled = !temSabor;
    pedirBtn.setAttribute('aria-disabled', String(!temSabor));
  }

  function toggleSabor(nome) {
    const idx = saboresSelecionados.indexOf(nome);
    if (idx !== -1) {
      saboresSelecionados.splice(idx, 1);
    } else {
      if (saboresSelecionados.length >= 3) return;
      saboresSelecionados.push(nome);
    }

    document.querySelectorAll('.sabor-select').forEach(btn => {
      const selecionado = saboresSelecionados.includes(btn.dataset.sabor);
      btn.setAttribute('aria-pressed', String(selecionado));
      btn.classList.toggle('sabor-selected', selecionado);
    });

    atualizarResumo();
  }

  baldeGrid.addEventListener('click', (e) => {
    const tag = e.target.closest('.sabor-select');
    if (!tag || !tag.dataset.sabor) return;
    e.stopPropagation();
    toggleSabor(tag.dataset.sabor);
  });

  pedirBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saboresSelecionados.length < 1) return;

    const lista = saboresSelecionados.join(', ');
    const msg   = `Olá! Quero pedir Balde de Sorvete com ${saboresSelecionados.length} sabor(es): ${lista} `;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  });

  atualizarResumo();
}