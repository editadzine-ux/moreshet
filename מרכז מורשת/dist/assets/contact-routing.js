/* GitHub Pages has no mail backend: prepare a draft, never report delivery. */
(() => {
  'use strict';
  const form = document.querySelector('#contact [data-contact-mailto]');
  if (!form) return;
  const routes = Object.freeze({
    visit: {name: 'שרון', email: 'sharon@recanati.org.il', subject: 'הזמנת ביקור'},
    general: {name: 'שרון', email: 'sharon@recanati.org.il', subject: 'פנייה כללית'},
    research: {name: 'יצחק', email: 'yrecanat@gmail.com', subject: 'תחקיר / ספרייה'}
  });
  const nameLabel = form.querySelector('[data-recipient-name]');
  const emailLink = form.querySelector('[data-recipient-email]');
  const status = form.querySelector('[data-contact-status]');
  const button = form.querySelector('button[type="submit"]');
  const initialNote = status.textContent;
  const value = name => form.elements.namedItem(name).value.trim();
  function updateDraft() {
    const route = routes[value('kind')] || routes.visit;
    nameLabel.textContent = `הפנייה ל${route.name}`;
    emailLink.href = `mailto:${route.email}`;
    emailLink.querySelector('bdi').textContent = route.email;
    const subject = `${route.subject} | ${value('subject')}`.replace(/[\r\n]+/g, ' ');
    const body = [
      `שלום ${route.name},`, '',
      `סוג הפנייה: ${route.subject}`,
      `שם מלא: ${value('name')}`,
      `אימייל לחזרה: ${value('email')}`, '',
      value('message')
    ].join('\n').replace(/\r?\n/g, '\r\n');
    const href = `mailto:${route.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.action = href;
    return href;
  }
  function changed() {
    updateDraft();
    status.textContent = initialNote;
  }
  form.addEventListener('input', changed);
  form.addEventListener('change', changed);
  form.addEventListener('reset', () => requestAnimationFrame(changed));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const href = updateDraft();
    window.location.href = href;
    status.textContent = 'יש להשלים את השליחה בתוכנת המייל. אם לא נפתח חלון, אפשר לפנות ישירות לכתובת המופיעה מעל הטופס.';
    // Preserve the draft: opening an email client is not proof that a message was sent.
  });
  addEventListener('pageshow', changed);
  updateDraft();
  button.disabled = false;
})();
