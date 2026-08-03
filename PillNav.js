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

    new MutationObserver(() => {
      enhance(header);
      enhance(modebar);
    }).observe(header, { childList: true, subtree: true });

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
