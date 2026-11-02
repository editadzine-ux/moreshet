(() => {
  'use strict';
  const root = document.querySelector('#salonika-site');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('keydown', event => {
    if (['Tab', 'Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) document.documentElement.classList.add('heritage-keyboard');
  });
  document.addEventListener('pointerdown', () => document.documentElement.classList.remove('heritage-keyboard'), {passive:true});
  const dock = root.querySelector('.chapter-dock');
  const header = root.querySelector(':scope > .nav');
  if (dock) {
    const rail = dock.querySelector('.chapter-dock-rail');
    const select = dock.querySelector('select');
    const links = [...rail.querySelectorAll('a[href^="#"]')];
    const chapters = links.map(link => ({link, target: document.getElementById(decodeURIComponent(link.hash.slice(1)))})).filter(item => item.target);
    let active = '', queued = false;
    const offset = () => (header?.getBoundingClientRect().height || 0) + dock.getBoundingClientRect().height + 20;
    function mark(item) {
      if (!item || active === item.link.hash) return;
      active = item.link.hash;
      links.forEach(link => {
        if (link === item.link) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
      select.value = active;
      // Keep the active item within its own rail; never move the document here.
      const r = item.link.getBoundingClientRect(), b = rail.getBoundingClientRect();
      if (b.width && (r.left < b.left || r.right > b.right)) rail.scrollBy({left:r.left < b.left ? r.left-b.left-8 : r.right-b.right+8, behavior:'instant'});
    }
    function update() {
      queued = false;
      const top = offset();
      let selected = chapters[0];
      for (const item of chapters) if (item.target.getBoundingClientRect().top <= top + 40) selected = item;
      mark(selected);
      dock.classList.toggle('is-stuck', dock.getBoundingClientRect().top <= (header?.getBoundingClientRect().height || 0) + 1);
    }
    function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    function dimensions() {
      document.documentElement.style.setProperty('--heritage-chapter-height', `${Math.ceil(dock.getBoundingClientRect().height)}px`);
      schedule();
    }
    function navigate(hash, smooth, changeHistory = true) {
      const item = chapters.find(item => item.link.hash === hash);
      if (!item) return;
      if (changeHistory && location.hash !== hash) history.pushState(null, '', hash);
      const focusTarget = item.target.querySelector('h2') || item.target;
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex','-1');
      focusTarget.focus({preventScroll:true});
      window.scrollTo({top:window.scrollY + item.target.getBoundingClientRect().top - offset(), behavior:smooth && !reduced.matches ? 'smooth' : 'instant'});
      mark(item);
    }
    links.forEach(link => link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); navigate(link.hash, event.detail !== 0);
    }));
    select.addEventListener('change', () => navigate(select.value, false));
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', dimensions, {passive:true});
    addEventListener('hashchange', () => navigate(location.hash, false, false));
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(dimensions); observer.observe(dock); if(header) observer.observe(header);
    }
    dimensions();
    Promise.resolve(document.fonts?.ready).then(() => {
      dimensions();
      if (location.hash) requestAnimationFrame(() => navigate(location.hash, false, false));
    });
  }
  // The unmodified Scroll Craft runtime drives brief, single-use album entries.
  // Mobile/reduced-motion readers retain a static, complete editorial layout.
  let craft;
  function mountMotion() {
    craft?.destroy(); craft = undefined;
    root.querySelectorAll('[data-sc-parallax]').forEach(el => {el.style.transform = '';});
    if (reduced.matches || !window.ScrollCraft || !root.querySelector('[data-sc-act], [data-sc-in]')) return;
    craft = window.ScrollCraft.mount(root, {lerp:1});
  }
  mountMotion();
  reduced.addEventListener('change', mountMotion);
  matchMedia('(min-width: 701px)').addEventListener('change', mountMotion);
})();
