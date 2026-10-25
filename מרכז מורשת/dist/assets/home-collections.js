(() => {
  const explorer = document.querySelector('.collections-explorer');
  if (!explorer) return;
  const panels = [...explorer.querySelectorAll('[data-collection-panel]')];
  const buttons = panels.map(panel => panel.querySelector('.collection-panel-trigger'));
  const bodies = panels.map(panel => panel.querySelector('.collection-panel-content'));
  const closes = panels.map(panel => panel.querySelector('.collection-panel-close'));
  let active = -1;
  function open(index, input = 'pointer') {
    active = index;
    explorer.dataset.input = input;
    panels.forEach((panel, i) => {
      const expanded = i === index;
      panel.classList.toggle('is-open', expanded);
      buttons[i].setAttribute('aria-expanded', String(expanded));
      panel.querySelector('.collection-panel-action').textContent = 'פתיחת הנושאים';
      panel.querySelector('.collection-panel-toggle').textContent = expanded ? '−' : '+';
      bodies[i].hidden = !expanded;
    });
  }
  explorer.classList.add('is-enhanced');
  open(-1);
  panels.forEach((panel, i) => {
    buttons[i].addEventListener('click', event => open(active === i ? -1 : i, event.detail === 0 ? 'keyboard' : 'pointer'));
    function close(input) {
      open(-1, input);
      buttons[i].focus({preventScroll: true});
      buttons[i].scrollIntoView({block: 'nearest', behavior: 'auto'});
    }
    closes[i].addEventListener('click', event => close(event.detail === 0 ? 'keyboard' : 'pointer'));
    panel.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || active !== i) return;
      event.preventDefault();
      close('keyboard');
    });
    buttons[i].addEventListener('keydown', event => {
      // The panels run right to left; retain native Tab, Enter and Space behavior.
      let next;
      if (event.key === 'ArrowLeft') next = (i + 1) % panels.length;
      if (event.key === 'ArrowRight') next = (i - 1 + panels.length) % panels.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = panels.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
    });
  });
})();
