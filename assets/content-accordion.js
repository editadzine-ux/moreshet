(() => {
  const accordion = document.querySelector('.content-accordion');
  if (!accordion) return;
  const cards = [...accordion.querySelectorAll('.content-card')];
  if (!cards.length) return;
  const triggers = cards.map(card => card.querySelector('.content-trigger'));
  const bodies = cards.map(card => card.querySelector('.content-body'));
  const mobile = matchMedia('(max-width: 900px)');
  const compact = matchMedia('(max-width: 1200px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = -1;
  function open(index, input = 'pointer', reveal = false) {
    activeIndex = index;
    accordion.dataset.input = input;
    cards.forEach((card, i) => {
      card.classList.toggle('is-open', i === index);
      triggers[i].setAttribute('aria-expanded', String(i === index));
      bodies[i].hidden = i !== index;
    });
    if (compact.matches && !mobile.matches && reveal && index >= 0) {
      cards[index].scrollIntoView({block: 'nearest', inline: 'nearest', behavior: input === 'keyboard' || reduced.matches ? 'auto' : 'smooth'});
    }
  }
  accordion.classList.add('is-enhanced');
  open(mobile.matches ? -1 : 0);
  mobile.addEventListener('change', () => {
    if (!mobile.matches && activeIndex === -1) open(0);
  });
  cards.forEach((card, i) => {
    card.addEventListener('pointerenter', () => {
      if (!hover.matches || compact.matches) return;
      if (bodies.some((body, j) => j !== i && body.contains(document.activeElement))) return;
      open(i);
    });
    triggers[i].addEventListener('click', event => {
      const next = mobile.matches && activeIndex === i ? -1 : i;
      open(next, event.detail === 0 ? 'keyboard' : 'pointer', true);
    });
    triggers[i].addEventListener('focus', () => {
      if (!mobile.matches) open(i, 'keyboard', true);
    });
    triggers[i].addEventListener('keydown', event => {
      let next;
      if (event.key === (mobile.matches ? 'ArrowDown' : 'ArrowLeft')) next = (i + 1) % cards.length;
      if (event.key === (mobile.matches ? 'ArrowUp' : 'ArrowRight')) next = (i - 1 + cards.length) % cards.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = cards.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      triggers[next].focus();
    });
  });
})();
