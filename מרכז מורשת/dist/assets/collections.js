(() => {
  document.querySelectorAll('details.collection-topic').forEach(topic => {
    const summary = topic.querySelector('summary');
    const toggle = topic.querySelector('.collection-topic-toggle');
    function sync() { toggle.textContent = topic.open ? '−' : '+'; }
    function close() {
      topic.open = false;
      sync();
      summary.focus({preventScroll: true});
      summary.scrollIntoView({block: 'nearest', behavior: 'auto'});
    }
    topic.querySelector('.collection-topic-close')?.addEventListener('click', close);
    topic.addEventListener('toggle', sync);
    topic.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !topic.open) return;
      event.preventDefault();
      close();
    });
    sync();
  });
  function revealTopic() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const topic = document.getElementById(id);
    if (!topic?.matches('details.collection-topic')) return;
    topic.open = true;
    requestAnimationFrame(() => topic.scrollIntoView({ block: 'start' }));
  }
  revealTopic();
  window.addEventListener('hashchange', revealTopic);
})();
