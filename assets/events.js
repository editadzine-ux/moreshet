(() => {
  const section = document.getElementById('events');
  if (!section) return;
  const rail = section.querySelector('.rail');
  const cards = Array.from(rail.querySelectorAll('.slide'));
  if (!cards.length) return;
  cards.forEach((card, index) => card.setAttribute('aria-label', `${index + 1} מתוך ${cards.length}`));
  const dots = section.querySelector('.ev-dots');
  const controls = section.querySelector('.ev-ctrl');
  const previous = section.querySelector('[data-prev]');
  const next = section.querySelector('[data-next]');
  const count = section.querySelector('.ev-count');
  const progress = section.querySelector('.ev-prog span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let first = 0;
  let visible = 1;
  let last = 0;
  let step = 1;
  let direction = -1;
  let frame = 0;
  const pad = number => String(number).padStart(2, '0');

  function update() {
    const end = Math.min(first + visible, cards.length);
    const range = visible > 1 ? `${pad(first + 1)}–${pad(end)}` : pad(first + 1);
    count.querySelector('bdi').textContent = `${range} / ${pad(cards.length)}`;
    count.setAttribute('aria-label', visible > 1
      ? `אירועים ${first + 1} עד ${end} מתוך ${cards.length}`
      : `אירוע ${first + 1} מתוך ${cards.length}`);
    progress.style.width = `${end / cards.length * 100}%`;
    previous.disabled = first === 0;
    next.disabled = first === last;
    Array.from(dots.children).forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === first));
    });
  }

  function go(index, behavior = reducedMotion.matches ? 'instant' : 'smooth') {
    first = Math.max(0, Math.min(last, index));
    const distance = Math.min(first * step, rail.scrollWidth - rail.clientWidth);
    rail.scrollTo({left: direction * Math.max(0, distance), behavior});
    update();
  }

  function measure() {
    const style = getComputedStyle(rail);
    visible = Math.min(cards.length, Number(style.getPropertyValue('--event-cards')) || 1);
    last = Math.max(0, cards.length - visible);
    step = cards[0].getBoundingClientRect().width + (parseFloat(style.columnGap) || 0);
    direction = style.direction === 'rtl' ? -1 : 1;
    dots.replaceChildren();
    for (let index = 0; index <= last; index++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', `הצגת ${cards[index].querySelector('h3').textContent}`);
      dot.setAttribute('aria-controls', rail.id);
      dot.appendChild(document.createElement('span'));
      dot.addEventListener('click', () => go(index));
      dots.appendChild(dot);
    }
    dots.hidden = controls.hidden = last === 0;
    go(first, 'instant');
  }

  previous.addEventListener('click', () => go(first - 1));
  next.addEventListener('click', () => go(first + 1));
  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return;
    const forward = direction === -1 ? 'ArrowLeft' : 'ArrowRight';
    const backward = direction === -1 ? 'ArrowRight' : 'ArrowLeft';
    const target = event.key === forward ? first + 1 : event.key === backward ? first - 1
      : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (target === null) return;
    event.preventDefault();
    go(target);
  });
  rail.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      first = Math.max(0, Math.min(last, Math.round(Math.abs(rail.scrollLeft) / step)));
      update();
    });
  }, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(rail);
  else window.addEventListener('resize', measure);
  measure();
})();
