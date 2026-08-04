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

    document.querySelectorAll('[data-mobile-proxy]').forEach(control => {
      const active = Boolean(states[control.dataset.mobileProxy]);
      control.classList.toggle('is-active', active);
      if (active) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    });
  }

  function stabilizeCoverTagline() {
    const tagline = document.querySelector('.cover-tagline');
    const book = document.querySelector('#flipbook');
    if (!tagline || !book) return;

    let restoreTimer;
    const beginCoverTurn = () => {
      if ((location.hash || '#cover') !== '#cover') return;
      window.clearTimeout(restoreTimer);
      tagline.classList.add('is-turning');
      tagline.classList.remove('is-visible');
      restoreTimer = window.setTimeout(() => {
        if ((location.hash || '#cover') === '#cover') {
          tagline.classList.remove('is-turning');
          tagline.classList.add('is-visible');
        }
      }, 1100);
    };

    ['open-guide', 'next', 'edge-next', 'selected', 'resume', 'contact'].forEach(id => {
      const control = document.getElementById(id);
      if (control) {
        control.addEventListener('pointerdown', beginCoverTurn, { passive: true });
        control.addEventListener('click', beginCoverTurn);
      }
    });
    book.addEventListener('pointerdown', beginCoverTurn, { passive: true });

    // Trackpad and mouse-wheel page turns bypass the book's pointer controls.
    // Mirror the flipbook's wheel threshold so the cover copy disappears as
    // soon as a downward scroll actually commits to opening the first page.
    let coverWheelTotal = 0;
    let coverWheelEnd;
    window.addEventListener('wheel', event => {
      const target = event.target;
      if ((location.hash || '#cover') !== '#cover' || event.deltaY <= 0 ||
          (target instanceof Element && target.closest('input, textarea, select, .contents-drawer'))) {
        return;
      }

      window.clearTimeout(coverWheelEnd);
      coverWheelEnd = window.setTimeout(() => { coverWheelTotal = 0; }, 220);
      coverWheelTotal += event.deltaY;
      if (coverWheelTotal < 55) return;

      coverWheelTotal = 0;
      beginCoverTurn();
    }, { passive: true });

    const folio = document.querySelector('#folio');
    if (folio) {
      new MutationObserver(() => {
        window.clearTimeout(restoreTimer);
        tagline.classList.remove('is-turning');
        tagline.classList.toggle('is-visible', (location.hash || '#cover') === '#cover');
      }).observe(folio, { childList: true, characterData: true, subtree: true });
    }
    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === 'Enter') beginCoverTurn();
    });
    window.addEventListener('hashchange', () => {
      if ((location.hash || '#cover') !== '#cover') {
        window.clearTimeout(restoreTimer);
        tagline.classList.remove('is-turning', 'is-visible');
      }
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
    const contentsButton = document.querySelector('#contents-button');
    const indexButton = document.querySelector('#index-button');
    const modeSwitch = document.querySelector('#mode-switch');
    const previous = document.querySelector('#edge-prev');
    const next = document.querySelector('#edge-next');
    const siteShell = reader?.closest('.site-shell');
    if (reader && siteShell && contact && contentsButton && indexButton && modeSwitch && previous && next && !siteShell.querySelector('.mobile-bottom-pill-row')) {
      const mobileTop = document.createElement('nav');
      const mobileHome = document.createElement('button');
      const mobileFolio = document.createElement('button');
      const mobileMenuButton = document.createElement('button');
      const mobileMenu = document.createElement('div');
      const dock = document.createElement('nav');
      const mobilePrevious = document.createElement('button');
      const mobileNext = document.createElement('button');

      mobileTop.className = 'mobile-top-pill-row pill-nav-row';
      mobileTop.setAttribute('aria-label', 'Mobile site navigation');
      mobileHome.type = mobileFolio.type = mobileMenuButton.type = 'button';
      mobileHome.className = 'mobile-home-action';
      mobileFolio.className = 'mobile-folio-action';
      mobileMenuButton.className = 'mobile-menu-action';
      mobileHome.textContent = 'Hannah Tran';
      mobileFolio.textContent = 'Vol. I / COVER';
      mobileMenuButton.textContent = 'Menu';
      mobileMenuButton.setAttribute('aria-haspopup', 'dialog');
      mobileMenuButton.setAttribute('aria-controls', 'mobile-menu');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      mobileHome.addEventListener('click', () => home?.click());

      mobileMenu.id = 'mobile-menu';
      mobileMenu.className = 'mobile-menu-sheet';
      mobileMenu.hidden = true;
      mobileMenu.setAttribute('role', 'dialog');
      mobileMenu.setAttribute('aria-modal', 'true');
      mobileMenu.setAttribute('aria-label', 'Site menu');
      mobileMenu.innerHTML = '<div class="mobile-menu-head"><b>Navigate</b><button type="button" class="mobile-menu-close" aria-label="Close menu">Close ×</button></div><div class="mobile-menu-links"></div><div class="mobile-menu-language"><span>Language</span><button type="button" data-language="EN">EN</button><button type="button" data-language="DK">DK</button></div>';

      const menuLinks = mobileMenu.querySelector('.mobile-menu-links');
      [
        ['selected', 'Selected work'],
        ['resume', 'Résumé'],
        ['contact', 'Contact'],
        ['contents-button', 'Contents'],
        ['index-button', 'Index']
      ].forEach(([id, label]) => {
        const action = document.createElement('button');
        action.type = 'button';
        action.textContent = label;
        action.dataset.mobileProxy = id;
        action.addEventListener('click', () => {
          document.getElementById(id)?.click();
          closeMobileMenu();
        });
        menuLinks.append(action);
      });

      function closeMobileMenu() {
        mobileMenu.hidden = true;
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.classList.remove('is-active');
      }

      mobileMenuButton.addEventListener('click', () => {
        const opening = mobileMenu.hidden;
        mobileMenu.hidden = !opening;
        mobileMenuButton.setAttribute('aria-expanded', String(opening));
        mobileMenuButton.classList.toggle('is-active', opening);
        if (opening) mobileMenu.querySelector('.mobile-menu-close')?.focus();
      });
      mobileMenu.querySelector('.mobile-menu-close')?.addEventListener('click', closeMobileMenu);
      mobileMenu.addEventListener('click', event => {
        const language = event.target.closest('[data-language]');
        if (!language) return;
        const languageCode = language.dataset.language === 'DK' ? 'da' : 'en';
        header.querySelector(`.language-switcher button[data-lang="${languageCode}"]`)?.click();
        closeMobileMenu();
      });
      mobileMenu.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMobileMenu();
      });

      dock.className = 'mobile-bottom-pill-row pill-nav-row';
      dock.setAttribute('aria-label', 'Mobile page navigation');
      mobilePrevious.type = mobileNext.type = 'button';
      mobilePrevious.className = 'mobile-page-arrow';
      mobileNext.className = 'mobile-page-arrow';
      mobilePrevious.textContent = '← Previous';
      mobileNext.textContent = 'Next →';
      mobilePrevious.setAttribute('aria-label', 'Previous page');
      mobileNext.setAttribute('aria-label', 'Next page');
      mobilePrevious.addEventListener('click', () => previous.click());
      mobileNext.addEventListener('click', () => next.click());
      mobileTop.append(mobileHome, mobileFolio, mobileMenuButton);
      dock.append(mobilePrevious, mobileNext);
      siteShell.prepend(mobileTop);
      siteShell.append(mobileMenu);
      siteShell.append(dock);
      mobileTop.querySelectorAll('button').forEach(labelControl);
      dock.querySelectorAll('button').forEach(labelControl);

      const syncFolio = () => {
        const folioText = document.querySelector('#folio')?.textContent.trim() || 'COVER';
        const isDanish = document.documentElement.lang === 'da';
        const localizedFolio = isDanish && folioText === 'COVER' ? 'FORSIDE' : folioText;
        const label = `${isDanish ? 'Bind I' : 'Vol. I'} / ${localizedFolio}`;
        const primary = mobileFolio.querySelector('.pill-label');
        const hover = mobileFolio.querySelector('.pill-label-hover');
        if (primary) primary.textContent = label;
        if (hover) hover.textContent = label;
      };
      const folioLabel = document.querySelector('#folio');
      if (folioLabel) new MutationObserver(syncFolio).observe(folioLabel, { childList: true, characterData: true, subtree: true });
      new MutationObserver(syncFolio).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      syncFolio();
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
    stabilizeCoverTagline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePillNav, { once: true });
  } else {
    initializePillNav();
  }
})();
