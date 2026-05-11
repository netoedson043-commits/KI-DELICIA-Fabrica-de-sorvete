document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '557598279616';
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.prod-card');
    if (!card) return;

    const targetId = card.dataset.target;
    if (!targetId) return;

    const panel = document.getElementById(targetId);
    const isOpen = card.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.prod-card').forEach(c => {
      c.setAttribute('aria-expanded', 'false');
      const p = document.getElementById(c.dataset.target);
      if (p) p.classList.remove('open');
    });

    if (!isOpen && panel) {
      card.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');

      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  });

  const baldeGrid = document.getElementById('baldeGrid');
  const baldePedirBtn = document.getElementById('baldePedir');
  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');

  if (baldeGrid && baldePedirBtn && slot1 && slot2 && slot3) {
    const getSlotNome = (slotEl) => slotEl?.querySelector('.slot__nome');
    const slotNomeEls = [getSlotNome(slot1), getSlotNome(slot2), getSlotNome(slot3)];

    let selectedBaldeSabores = [];

    function renderBaldeResumo() {
      slotNomeEls.forEach((el) => {
        if (!el) return;
        el.textContent = '—';
      });

      selectedBaldeSabores.slice(0, 3).forEach((nome, idx) => {
        const slotNome = slotNomeEls[idx];
        if (slotNome) slotNome.textContent = nome;
      });

      const habilitar = selectedBaldeSabores.length >= 1;
      baldePedirBtn.disabled = !habilitar;

      if (habilitar) {
        baldePedirBtn.style.pointerEvents = 'auto';
        baldePedirBtn.setAttribute('aria-disabled', 'false');
      } else {
        baldePedirBtn.style.pointerEvents = 'none';
        baldePedirBtn.setAttribute('aria-disabled', 'true');
      }
    }

    function toggleBaldeSabor(nome) {
      const currentIdx = selectedBaldeSabores.indexOf(nome);
      if (currentIdx !== -1) {
        selectedBaldeSabores.splice(currentIdx, 1);
      } else {
        if (selectedBaldeSabores.length >= 3) return; 
        selectedBaldeSabores.push(nome);
      }

      document.querySelectorAll('.sabor-select').forEach(btn => {
        const isSelected = selectedBaldeSabores.includes(btn.dataset.sabor);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

        if (isSelected) {
          btn.style.background = '#E8503A';
          btn.style.color = '#ffffff';
          btn.style.borderColor = '#E8503A';
        } else {
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
        }
      });

      renderBaldeResumo();
    }

    baldeGrid.addEventListener('click', (e) => {
      const target = e.target.closest('.sabor-select');
      if (!target) return;
      e.stopPropagation();

      const nome = target.dataset.sabor;
      if (!nome) return;

      toggleBaldeSabor(nome);
    });

    baldePedirBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (selectedBaldeSabores.length < 1) return;

      const saboresTexto = selectedBaldeSabores.join(', ');
      const msg = `Olá! Quero pedir Balde de Sorvete com ${selectedBaldeSabores.length} sabor(es): ${saboresTexto} `;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    renderBaldeResumo();
  }

  const MSG_REVendedor = 'Olá! Vi o site da Ki-Delicia e gostaria de mais informações ';

  document.querySelectorAll('.wpp-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isDentroDoPote = el.closest('#painel-pote');
      const isDentroDoPicole = el.closest('#painel-picole');

      const msg = (isDentroDoPote || isDentroDoPicole)
        ? MSG_REVendedor
        : (el.dataset.msg || 'Olá! Gostaria de fazer um pedido na Ki-Delicia ');

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

});

