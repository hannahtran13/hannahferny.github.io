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
    const folio = document.querySelector('#folio');

    if (!shell) return;

    const announcement = document.createElement('p');
    announcement.className = 'sr-only';
    announcement.id = 'page-announcement';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    shell.appendChild(announcement);

    function announcePage() {
      const hash = location.hash || '#cover';
      const page = hash === '#cover' ? document.querySelector('.cover') : document.querySelector(hash);
      const title = page?.querySelector('h1, h2, blockquote')?.textContent.trim();
      const number = folio?.textContent.trim();
      announcement.textContent = title ? `Page ${number}: ${title}` : `Page ${number}`;
    }

    if (folio) new MutationObserver(announcePage).observe(folio, { childList: true, characterData: true, subtree: true });
    window.addEventListener('hashchange', announcePage);
    announcePage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility, { once: true });
  } else {
    initializeAccessibility();
  }
})();
