(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduceMotion.matches && window.St && window.St.PageFlip) {
    const PageFlip = window.St.PageFlip;
    window.St.PageFlip = new Proxy(PageFlip, {
      construct(Target, args) {
        const options = Object.assign({}, args[1], {
          flippingTime: 1,
          drawShadow: false,
          maxShadowOpacity: 0
        });
        return Reflect.construct(Target, [args[0], options]);
      }
    });
  }

  function initializeAccessibility() {
    const shell = document.querySelector('.site-shell');
    const drawer = document.querySelector('#contents');
    const openButton = document.querySelector('#contents-button');
    const closeButton = document.querySelector('#close-contents');
    const heading = drawer?.querySelector('h2');
    const folio = document.querySelector('#folio');

    if (!shell || !drawer || !openButton || !closeButton || !heading) return;

    heading.id = 'contents-title';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', heading.id);
    openButton.setAttribute('aria-haspopup', 'dialog');
    openButton.setAttribute('aria-controls', drawer.id);
    openButton.setAttribute('aria-expanded', 'false');

    const announcement = document.createElement('p');
    announcement.className = 'sr-only';
    announcement.id = 'page-announcement';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    shell.appendChild(announcement);

    let previousFocus = null;
    let drawerOpen = false;
    const background = () => Array.from(shell.children).filter(element => element !== drawer && element !== announcement);

    function setBackgroundAvailable(available) {
      background().forEach(element => {
        if (available) {
          element.inert = false;
          if (element.dataset.previousAriaHidden === '') element.removeAttribute('aria-hidden');
          else if (element.dataset.previousAriaHidden) element.setAttribute('aria-hidden', element.dataset.previousAriaHidden);
          delete element.dataset.previousAriaHidden;
        } else {
          element.dataset.previousAriaHidden = element.getAttribute('aria-hidden') || '';
          element.inert = true;
          element.setAttribute('aria-hidden', 'true');
        }
      });
    }

    function syncDrawer() {
      const isOpen = !drawer.hidden;
      if (isOpen === drawerOpen) return;
      drawerOpen = isOpen;
      openButton.setAttribute('aria-expanded', String(isOpen));
      setBackgroundAvailable(!isOpen);

      if (isOpen) {
        previousFocus = document.activeElement;
        window.requestAnimationFrame(() => closeButton.focus());
      } else if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
        previousFocus = null;
      }
    }

    new MutationObserver(syncDrawer).observe(drawer, { attributes: true, attributeFilter: ['hidden'] });
    openButton.addEventListener('click', () => queueMicrotask(syncDrawer));
    closeButton.addEventListener('click', () => queueMicrotask(syncDrawer));

    drawer.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeButton.click();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(drawer.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(element => !element.hidden);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    function announcePage() {
      const hash = location.hash || '#cover';
      const page = hash === '#cover' ? document.querySelector('.cover') : document.querySelector(hash);
      const title = page?.querySelector('h1, h2, blockquote')?.textContent.trim();
      const number = folio?.textContent.trim();
      announcement.textContent = title ? `Page ${number}: ${title}` : `Page ${number}`;
    }

    if (folio) new MutationObserver(announcePage).observe(folio, { childList: true, characterData: true, subtree: true });
    window.addEventListener('hashchange', announcePage);
    syncDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility, { once: true });
  } else {
    initializeAccessibility();
  }
})();
