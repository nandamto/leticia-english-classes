(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* revela os blocos ao rolar */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* nav some ao descer e volta ao subir */
  const nav = $('#nav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* alternador R$ / € nos planos */
  const toggle = $('#toggle');
  if (toggle) {
    const fmt = {
      BRL: (n) => 'R$ ' + Number(n).toLocaleString('pt-BR'),
      EUR: (n) => n + '€'
    };
    const set = (cur) => {
      toggle.dataset.cur = cur;
      $$('button', toggle).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
      $$('.price').forEach((p) => {
        p.textContent = fmt[cur](p.dataset[cur.toLowerCase()]);
      });
      try { localStorage.setItem('leti-cur', cur); } catch (e) {}
    };
    $$('button', toggle).forEach((b) => b.addEventListener('click', () => set(b.dataset.cur)));
    let saved = null;
    try { saved = localStorage.getItem('leti-cur'); } catch (e) {}
    if (saved === 'EUR') set('EUR');
  }
})();
