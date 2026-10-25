(() => {
  const rooms = document.querySelector('.about-rooms');
  if (!rooms || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    });
  }, {threshold: .15});
  rooms.classList.add('rooms-enhanced');
  rooms.querySelectorAll('.about-room').forEach(room => observer.observe(room));
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    rooms.classList.remove('rooms-enhanced');
  });
})();
