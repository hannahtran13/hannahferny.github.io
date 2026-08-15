# Book page system

New numbered pages should use the shared book components below. Their sizing and placement are controlled by the `--book-*` variables at the top of `MediaScapeDemo.css`.

```html
<article class="paper-page" id="page-XX">
  <div class="page-inner">
    <div class="page-kicker">
      <span>Section or project label</span>
      <span>XX</span>
    </div>

    <h2 class="book-display-title">Page title</h2>
    <p class="deck">Optional question or deck</p>
    <p class="body-copy book-supporting-copy">Supporting copy.</p>
  </div>
</article>
```

## Shared reference values

- Page top inset: `--book-header-top`
- Page horizontal inset: `--book-header-inline`
- Kicker and folio: `--book-header-size` / `--book-header-line-height`
- Display title: `--book-display-size`, `--book-display-line-height`, `--book-display-weight`, `--book-display-tracking`
- Title distance from header: `--book-display-top-gap`
- Deck: `--book-deck-size` / `--book-deck-line-height`
- Supporting copy: `--book-body-size` / `--book-body-line-height`

Use page-specific CSS for composition, color, imagery, and intentional editorial exceptions. Do not redefine the shared header or content sizes on an individual page unless the difference is deliberate.
