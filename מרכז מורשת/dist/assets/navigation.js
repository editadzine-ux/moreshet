(() => {
  const root = document.getElementById('salonika-site');
  if (!root) return;
  const header = root.querySelector(':scope > .nav');
  const triggers = [...root.querySelectorAll('[data-tog]')];
  const panels = [...root.querySelectorAll('.spop')];
  let current = null;
  let opener = null;
  const mobileMenu = root.querySelector('.m-menu');
  const mobilePanel = mobileMenu?.querySelector('.m-panel');
  const mobileTrigger = mobileMenu?.querySelector('summary');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let mobileExpanded = Boolean(mobileMenu?.open);
  let mobileCloseTimer;

  function setMobileOpen(open, animate = true, resetChildren = false) {
    if (!mobileMenu || !mobilePanel) return;
    clearTimeout(mobileCloseTimer);
    mobileExpanded = open;
    const motion = animate && !reducedMotion.matches;
    mobileMenu.dataset.menuMotion = motion ? 'on' : 'off';
    mobileTrigger.setAttribute('aria-expanded', String(open));
    mobilePanel.inert = !open;
    if (open) {
      if (!mobileMenu.open) {
        mobileMenu.open = true;
        mobilePanel.getBoundingClientRect();
      }
      mobileMenu.classList.add('menu-visible');
    } else {
      if (mobilePanel.contains(document.activeElement)) mobileTrigger.focus({preventScroll: true});
      mobileMenu.classList.remove('menu-visible');
      const finish = () => {
        mobileMenu.open = false;
        if (resetChildren) mobileMenu.querySelectorAll('details[open]').forEach(category => { category.open = false; });
      };
      if (motion && mobileMenu.open) mobileCloseTimer = setTimeout(finish, 180);
      else finish();
    }
  }
  if (mobilePanel && mobileTrigger) {
    mobileMenu.classList.add('menu-animated');
    setMobileOpen(mobileExpanded, false);
    mobileTrigger.addEventListener('click', event => {
      event.preventDefault();
      setMobileOpen(!mobileExpanded, event.detail !== 0);
    });
    reducedMotion.addEventListener('change', () => setMobileOpen(mobileExpanded, false));
  }

  function closePanel(restoreFocus = false) {
    panels.forEach(panel => panel.classList.remove('on'));
    triggers.forEach(button => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('data-popup-open', 'false');
    });
    current = null;
    if (restoreFocus && opener) opener.focus();
  }

  if (header) {
    const desktop = header.querySelector('.desktop-navigation');
    const list = header.querySelector('.nav-list');
    const mobileMenu = header.querySelector('.m-menu');
    const syncHeaderLayout = () => {
      const wasCompact = header.classList.contains('nav--compact');
      header.classList.remove('nav--compact');
      const desktopVisible = desktop && getComputedStyle(desktop).display !== 'none';
      const compact = desktopVisible && list && list.getBoundingClientRect().width > desktop.clientWidth + 1;
      header.classList.toggle('nav--compact', Boolean(compact));
      if (compact || !desktopVisible) {
        if (current) closePanel();
        if (desktop?.contains(document.activeElement)) mobileMenu?.querySelector('summary')?.focus();
      } else if (mobileMenu && (mobileMenu.open || wasCompact)) {
        setMobileOpen(false, false);
        if (mobileMenu.contains(document.activeElement)) desktop.querySelector('.nav-link')?.focus();
      }
      document.documentElement.style.setProperty('--salonika-nav-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };
    syncHeaderLayout();
    if ('ResizeObserver' in window) new ResizeObserver(syncHeaderLayout).observe(header);
    else window.addEventListener('resize', syncHeaderLayout);
    document.fonts?.ready.then(syncHeaderLayout);
  }

  triggers.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      if (current === button.dataset.tog) {
        closePanel();
        return;
      }
      closePanel();
      const panel = panels.find(item => item.dataset.pop === button.dataset.tog);
      if (!panel) return;
      current = button.dataset.tog;
      opener = button;
      panel.classList.add('on');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('data-popup-open', 'true');
      panel.querySelector('a, button')?.focus();
    });
  });

  root.querySelectorAll('[data-close]').forEach(control => {
    control.addEventListener('click', () => closePanel(control.tagName === 'BUTTON'));
  });
  root.querySelectorAll('.m-menu a[href]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      setMobileOpen(false, event.detail !== 0, true);
    });
  });
  document.addEventListener('click', event => {
    if (current && !event.target.closest('.spop, [data-tog]')) closePanel();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (current) {
      closePanel(true);
      return;
    }
    const focusedCategory = document.activeElement?.closest('.m-cat[open]');
    const mobileCategory = focusedCategory || root.querySelector('.m-cat[open]');
    if (mobileCategory) {
      mobileCategory.open = false;
      mobileCategory.querySelector('summary')?.focus();
      return;
    }
    const mobileMenu = root.querySelector('.m-menu[open]');
    if (mobileMenu) {
      setMobileOpen(false, false);
      mobileMenu.querySelector('summary')?.focus();
    }
  });
})();
