// Interações leves: borda da barra ao rolar, elementos que aparecem ao rolar, cartão que inclina com o mouse
// e destaque da seção atual no sumário das páginas legais.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('scrolled')) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  const card = document.getElementById('card');
  if (card && !reduce && window.matchMedia('(hover: hover)').matches) {
    const stage = card.parentElement;
    stage.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${x * 14}deg`);
      card.style.setProperty('--rx', `${-y * 14}deg`);
      card.style.setProperty('--sx', `${30 + x * 80}%`);
    });
    stage.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--sx', '30%');
    });
  }

  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        tocLinks.forEach((a) => a.removeAttribute('aria-current'));
        const link = byId.get(e.target.id);
        if (link) link.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-80px 0px -70% 0px' });
    byId.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
