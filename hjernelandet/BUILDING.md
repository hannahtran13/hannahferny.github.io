# Hjernelandet dispatch registry

Dispatch metadata lives in `data/dispatches.json`. Article bodies remain ordinary HTML files under `articles/`.

When adding or editing a dispatch:

1. Add or update its record in `data/dispatches.json`.
2. Add the article page and artwork referenced by that record.
3. Run `npm run check` to validate the registry.
4. Run `npm run build` to regenerate the homepage, archive, province listings, counts, filters, and sitemap.
5. Review and commit both the registry and generated HTML.

Only one published record may use `"featured": true`. If no published record is explicitly featured, the newest published dispatch is used.

The build fails on duplicate numbers, codes, slugs, or URLs; invalid dates and reading times; unknown provinces; multiple featured records; and missing article pages or images. If `image` is omitted, the province fallback is used.

Do not manually edit content between `GENERATED` comments because the next build will replace it.
