/* Until a receiving service is configured, never transmit or claim receipt of a form. */
(() => {
  document.querySelectorAll('[data-contact-preview]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelector('[data-contact-status]')?.focus({ preventScroll: false });
    });
  });
})();
