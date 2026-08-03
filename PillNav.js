(function () {
  function labelControl(control) {
    if (control.dataset.pillEnhanced === 'true' && control.querySelector(':scope > .label-stack')) return;
    const label = control.textContent.trim();
    if (!label) return;

    control.dataset.pillEnhanced = 'true';
    control.classList.add('pill-control');
    control.replaceChildren();

    const stack = document.createElement('span');
    const primary = document.createElement('span');
    const hover = document.createElement('span');
    stack.className = 'label-stack';
    primary.className = 'pill-label';
    hover.className = 'pill-label-hover';
    primary.textContent = label;
    hover.textContent = label;
    hover.setAttribute('aria-hidden', 'true');
    stack.append(primary, hover);
    control.append(stack);
  }

  function updateActiveState() {
    const hash = location.hash || '#cover';
    const page = Number((hash.match(/page-(\d+)/) || [])[1]);
    const index = document.querySelector('#index');
    const states = {
      selected: Number.isFinite(page) && page >= 4 && page <= 13,
      resume: Number.isFinite(page) && page >= 28 && page <= 30,
      contact: Number.isFinite(page) && page >= 31,
      'index-button': index ? !index.hidden : false,
      'mode-switch': index ? !index.hidden : false
    };

    Object.entries(states).forEach(([id, active]) => {
      const control = document.getElementById(id);
      if (!control) return;
      control.classList.toggle('is-active', active);
      if (active) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    });
  }

  function initializePillNav() {
    const header = document.querySelector('.site-header');
    const modebar = document.querySelector('.modebar');
    if (!header || !modebar) return;

    header.classList.add('pill-nav-row', 'pill-nav-primary');
    modebar.classList.add('pill-nav-row', 'pill-nav-secondary');
    header.closest('.site-shell')?.classList.add('pill-navigation');

    const home = header.querySelector(':scope > a');
    if (home) {
      home.classList.add('pill-home');
      home.setAttribute('aria-label', 'Hannah Tran — cover');
      labelControl(home);
    }

    const enhance = root => root.querySelectorAll('button').forEach(control => {
      if (control.closest('.language-switcher')) return;
      if (control.id === 'prev') control.setAttribute('aria-label', 'Previous page');
      if (control.id === 'next') control.setAttribute('aria-label', 'Next page');
      labelControl(control);
    });

    enhance(header);
    enhance(modebar);

    const reader = document.querySelector('#reader');
    const contact = document.querySelector('#contact');
    const modeSwitch = document.querySelector('#mode-switch');
    const previous = document.querySelector('#edge-prev');
    const next = document.querySelector('#edge-next');
    const siteShell = reader?.closest('.site-shell');
    if (reader && siteShell && contact && modeSwitch && previous && next && !siteShell.querySelector('.mobile-bottom-pill-row')) {
      const dock = document.createElement('nav');
      const mobilePrevious = document.createElement('button');
      const mobileContact = document.createElement('button');
      const mobileIndex = document.createElement('button');
      const mobileNext = document.createElement('button');
      dock.className = 'mobile-bottom-pill-row pill-nav-row';
      dock.setAttribute('aria-label', 'Mobile page navigation');
      mobilePrevious.type = mobileContact.type = mobileIndex.type = mobileNext.type = 'button';
      mobilePrevious.className = 'mobile-page-arrow';
      mobileNext.className = 'mobile-page-arrow';
      mobileContact.className = 'mobile-contact-action';
      mobileIndex.className = 'mobile-index-action';
      mobilePrevious.textContent = '←';
      mobileContact.textContent = 'Contact';
      mobileIndex.textContent = 'Open the index';
      mobileNext.textContent = '→';
      mobilePrevious.setAttribute('aria-label', 'Previous page');
      mobileNext.setAttribute('aria-label', 'Next page');
      mobileContact.addEventListener('click', () => contact.click());
      mobileIndex.addEventListener('click', () => modeSwitch.click());
      mobilePrevious.addEventListener('click', () => previous.click());
      mobileNext.addEventListener('click', () => next.click());
      dock.append(mobilePrevious, mobileContact, mobileIndex, mobileNext);
      siteShell.append(dock);
      dock.querySelectorAll('button').forEach(labelControl);

      const syncIndexLabel = () => {
        const source = modeSwitch.querySelector('.pill-label')?.textContent || modeSwitch.textContent;
        const primary = mobileIndex.querySelector('.pill-label');
        const hover = mobileIndex.querySelector('.pill-label-hover');
        if (primary) primary.textContent = source.trim();
        if (hover) hover.textContent = source.trim();
      };
      new MutationObserver(() => queueMicrotask(syncIndexLabel)).observe(modeSwitch, { childList: true, characterData: true, subtree: true });
      syncIndexLabel();
    }

    new MutationObserver(() => {
      enhance(header);
      enhance(modebar);
    }).observe(header, { childList: true, subtree: true });
    new MutationObserver(() => enhance(modebar)).observe(modebar, { childList: true, subtree: true });

    const index = document.querySelector('#index');
    if (index) new MutationObserver(updateActiveState).observe(index, { attributes: true, attributeFilter: ['hidden'] });
    const folio = document.querySelector('#folio');
    if (folio) new MutationObserver(updateActiveState).observe(folio, { childList: true, characterData: true, subtree: true });
    window.addEventListener('hashchange', updateActiveState);
    document.addEventListener('click', () => queueMicrotask(updateActiveState));
    updateActiveState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePillNav, { once: true });
  } else {
    initializePillNav();
  }
})();
