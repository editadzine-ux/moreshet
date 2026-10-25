(() => {
  const gallery = document.querySelector('[data-about-gallery]');
  if (!gallery) return;
  const thumbnails = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  if (!thumbnails.length) return;
  const photos = thumbnails.map(link => ({
    src: link.href,
    caption: link.dataset.caption,
    alt: link.querySelector('img').alt
  }));
  const image = gallery.querySelector('[data-gallery-image]');
  const opener = gallery.querySelector('[data-gallery-open]');
  const dialog = gallery.querySelector('[data-gallery-dialog]');
  const dialogImage = gallery.querySelector('[data-gallery-dialog-image]');
  const counters = [...gallery.querySelectorAll('[data-gallery-count]')];
  let current = 0;
  let previousOverflow = '';

  function select(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.src;
    image.alt = photo.alt;
    opener.href = photo.src;
    opener.setAttribute('aria-label', `הגדלת התמונה: ${photo.caption}`);
    dialogImage.src = photo.src;
    dialogImage.alt = photo.alt;
    counters.forEach(counter => { counter.textContent = `${current + 1} מתוך ${photos.length}`; });
    thumbnails.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  thumbnails.forEach((link, index) => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(index);
    });
  });
  gallery.querySelector('[data-gallery-controls]').hidden = false;
  gallery.querySelectorAll('[data-gallery-prev]').forEach(button => {
    button.addEventListener('click', () => select(current - 1));
  });
  gallery.querySelectorAll('[data-gallery-next]').forEach(button => {
    button.addEventListener('click', () => select(current + 1));
  });

  // Normal image links remain available when modal dialogs are unsupported.
  if (typeof dialog.showModal === 'function') {
    opener.setAttribute('aria-haspopup', 'dialog');
    opener.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (dialog.open) return;
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
    gallery.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      opener.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }

  gallery.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    // In this RTL gallery the next photo is on the left.
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(current + (event.key === 'ArrowLeft' ? 1 : -1));
    }
  });
})();
