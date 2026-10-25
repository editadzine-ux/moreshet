(() => {
  const page = document.querySelector('#salonika-site.team-page');
  if (!page || !('IntersectionObserver' in window)) return;

  // Only decorative artwork reveals; names and roles are always visible.
  const scenes = [...page.querySelectorAll('.team-scene')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const artObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      artObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  if (!motion.matches) {
    page.classList.add('team-motion-ready');
    scenes.forEach((scene) => artObserver.observe(scene));
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    page.classList.remove('team-motion-ready');
    artObserver.disconnect();
  });

  // The native in-page links also indicate the section currently in view.
  const links = [...page.querySelectorAll('.team-index a[href^="#"]')];
  const sections = links.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const visible = new Map();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
    const current = sections.find((section) => visible.get(section.id));
    links.forEach((link) => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -45% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
})();
