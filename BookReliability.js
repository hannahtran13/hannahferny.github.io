(function () {
  const root = document.documentElement;
  root.classList.add('js');

  function showFallback(error) {
    if (document.body) document.body.classList.remove('book-mode');
    root.classList.add('book-fallback');
    if (error) console.error('The flipbook could not be initialized. Showing the scrollable portfolio instead.', error);
  }

  function watchInitialization() {
    const book = document.querySelector('#flipbook');
    if (!book) return;

    const finish = () => {
      if (!book.classList.contains('ready')) return false;
      root.classList.remove('book-fallback');
      document.body.classList.add('book-mode');
      return true;
    };

    if (finish()) return;

    const observer = new MutationObserver(() => {
      if (finish()) observer.disconnect();
    });
    observer.observe(book, { attributes: true, attributeFilter: ['class'] });

    window.setTimeout(() => {
      if (!finish()) {
        observer.disconnect();
        const reason = window.St && window.St.PageFlip
          ? new Error('PageFlip initialization did not complete')
          : new Error('PageFlip unavailable');
        showFallback(reason);
      }
    }, 2500);
  }

  window.addEventListener('error', event => {
    const source = event.filename || event.target?.src || '';
    const message = event.message || '';
    if (/page-flip|PageFlip|\bSt\b/.test(`${source} ${message}`)) showFallback(event.error || new Error(message));
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchInitialization, { once: true });
  } else {
    watchInitialization();
  }
})();
