import fs from "node:fs";
import path from "node:path";
import {
  dispatchImage,
  escapeHtml,
  paddedNumber,
  provinceCodes,
  provinceNames,
  publishedDispatches,
  readDispatches,
  replaceRegion,
  root,
  validateDispatches
} from "./registry.js";

const allRecords = validateDispatches(readDispatches());
const dispatches = publishedDispatches(allRecords);
const featured = dispatches.find((dispatch) => dispatch.featured) ?? dispatches[0];
const latestVolume = Math.max(...dispatches.map((dispatch) => dispatch.volume));
const currentVolume = dispatches.filter((dispatch) => dispatch.volume === latestVolume);
const latestDate = new Date(`${dispatches[0].date}T12:00:00`);
const dateLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(latestDate);

function writeGeneratedFile(relativePath, regions) {
  const file = path.join(root, relativePath);
  let html = fs.readFileSync(file, "utf8");
  for (const [region, content] of Object.entries(regions)) html = replaceRegion(html, region, content);
  fs.writeFileSync(file, html);
}

function archiveRow(dispatch) {
  const id = paddedNumber(dispatch.number);
  const provinceLabel = provinceNames[dispatch.province];
  return `        <article class="record" data-record-id="${id}" data-province="${escapeHtml(dispatch.province)}" data-title="${escapeHtml(dispatch.title.toLowerCase())}" data-location="${escapeHtml(dispatch.location.toLowerCase())}">
          <a href="${escapeHtml(dispatch.url)}" aria-label="Read ${escapeHtml(dispatch.title)}">
            <div class="record-number"><strong>${id}</strong><span>${escapeHtml(dispatch.code)}</span></div>
            <div class="record-image"><img src="${escapeHtml(dispatchImage(dispatch))}" alt="" loading="lazy"></div>
            <h3>${escapeHtml(dispatch.title)}</h3>
            <div class="province-band ${provinceCodes[dispatch.province]}"><span>${escapeHtml(provinceLabel)}</span></div>
            <div class="record-meta"><span>${escapeHtml(dispatch.location)}</span><span>${dispatch.readingTime} min read</span></div>
            <span class="record-arrow" aria-hidden="true">→</span>
          </a>
        </article>`;
}

function archiveStats() {
  return `        <div><dt>Dispatches</dt><dd data-total-dispatches>${paddedNumber(dispatches.length)}</dd></div>
        <div><dt>Provinces</dt><dd data-total-provinces>${paddedNumber(Object.keys(provinceNames).length)}</dd></div>
        <div><dt>Volume</dt><dd>${paddedNumber(latestVolume, 2)}</dd></div>
        <div><dt>Filed</dt><dd>${escapeHtml(dateLabel)}</dd></div>`;
}

function provinceFilters() {
  const counts = Object.fromEntries(Object.keys(provinceNames).map((province) => [province, 0]));
  for (const dispatch of dispatches) counts[dispatch.province] += 1;
  const buttons = [`        <button type="button" data-province="all" aria-pressed="true">All <span>${paddedNumber(dispatches.length, 2)}</span></button>`];
  for (const [province, label] of Object.entries(provinceNames)) {
    buttons.push(`        <button type="button" data-province="${province}" aria-pressed="false">${escapeHtml(label)} <span>${paddedNumber(counts[province], 2)}</span></button>`);
  }
  return buttons.join("\n");
}

function featuredSection(dispatch) {
  const place = dispatch.location.split(",")[0];
  return `    <section class="featured page-pad">
      <aside class="coordinates" aria-label="${escapeHtml(place)} coordinates">
        <span>${escapeHtml(dispatch.coordinates.latitude)}</span><b>⊙</b><span>${escapeHtml(dispatch.coordinates.longitude)}</span>
      </aside>
      <div class="feature-copy">
        <p class="eyebrow">Featured dispatch</p>
        <h2>${escapeHtml(dispatch.title)}</h2>
        <div class="arrow-rule">→</div>
        <p class="dek">${escapeHtml(dispatch.description)}</p>
        <a class="pill" href="${escapeHtml(dispatch.url)}">Read the latest dispatch <span>→</span></a>
      </div>
      <div class="hero-art" role="img" aria-label="${escapeHtml(dispatch.imageAlt)}">
        <img src="${escapeHtml(dispatchImage(dispatch))}" alt="${escapeHtml(dispatch.imageAlt)}">
        <span class="map-mark mark-a">A.${paddedNumber(dispatch.number, 2)}</span>
        <span class="map-mark mark-b">X: 231.4<br>Y: 87.6</span>
      </div>
    </section>`;
}

function recentCard(dispatch) {
  return `        <article class="dispatch-card ${escapeHtml(dispatch.cardTheme || "green")}">
          <div class="card-map"><span>${paddedNumber(dispatch.number, 2)}</span><i></i><b>✦</b></div>
          <p class="card-category">${escapeHtml(dispatch.category)}</p>
          <h3>${escapeHtml(dispatch.title)}</h3>
          <p>${escapeHtml(dispatch.description)}</p>
          <a href="${escapeHtml(dispatch.url)}">Read Dispatch <span>↗</span></a>
        </article>`;
}

function provinceResult(dispatch) {
  return `          <a class="result" data-result href="${escapeHtml(dispatch.url)}">
            <p class="result-url">hjernelandet / ${escapeHtml(dispatch.province)} / ${escapeHtml(dispatch.slug)}</p>
            <h2>${escapeHtml(dispatch.title)}</h2>
            <p>${escapeHtml(dispatch.description)}</p>
            <div class="result-meta"><span>Dispatch ${paddedNumber(dispatch.number, 2)}</span><span>${escapeHtml(dispatch.location)}</span><span>${dispatch.readingTime} min read</span></div>
          </a>`;
}

function emptyProvinceResult(province) {
  const label = provinceNames[province];
  return `          <div class="result soon" data-result>
            <p class="result-url">hjernelandet / ${province} / future-dispatch</p>
            <h2>Coming soon</h2>
            <p>The ${escapeHtml(label)} province is waiting for its first filed dispatch.</p>
            <div class="result-meta"><span>Not yet filed</span></div>
          </div>`;
}

const ascending = [...dispatches].sort((a, b) => a.number - b.number);
writeGeneratedFile("all-dispatches.html", {
  ARCHIVE_STATS: archiveStats(),
  PROVINCE_FILTERS: provinceFilters(),
  NUMERIC_SORT_OPTION: `          <option value="numeric">Numerical · ${paddedNumber(ascending[0].number)}–${paddedNumber(ascending.at(-1).number)}</option>`,
  ARCHIVE_RESULT_SUMMARY: `      <p id="result-summary" class="result-summary" aria-live="polite">${dispatches.length} dispatch${dispatches.length === 1 ? "" : "es"} shown</p>`,
  VOLUME_HEADING: `        <h2 id="volume-heading">Volume ${paddedNumber(latestVolume, 2)} <span>/ ${escapeHtml(dateLabel)} / ${numberWord(currentVolume.length)} records filed</span></h2>`,
  ARCHIVE_ROWS: ascending.map(archiveRow).join("\n\n")
});

writeGeneratedFile("index.html", {
  LATEST_DISPATCH_LINK: `        <a href="${escapeHtml(featured.url)}"><span>02</span><b>Latest Dispatch</b><em>↗</em></a>`,
  FEATURED_DISPATCH: featuredSection(featured),
  RECENT_DISPATCHES: dispatches.filter((dispatch) => dispatch !== featured).slice(0, 3).map(recentCard).join("\n\n")
});

for (const province of Object.keys(provinceNames)) {
  const provinceDispatches = dispatches.filter((dispatch) => dispatch.province === province);
  writeGeneratedFile(`${province}.html`, {
    PROVINCE_COUNT: `          <strong>${paddedNumber(provinceDispatches.length, 2)}</strong>`,
    PROVINCE_RESULTS: provinceDispatches.length ? provinceDispatches.map(provinceResult).join("\n") : emptyProvinceResult(province)
  });
}

const sitemapUrls = [
  ["https://hannahferny.com/hjernelandet/", dispatches[0].date],
  ["https://hannahferny.com/hjernelandet/all-dispatches.html", dispatches[0].date],
  ...Object.keys(provinceNames).map((province) => [`https://hannahferny.com/hjernelandet/${province}.html`, dispatches[0].date]),
  ...ascending.map((dispatch) => [`https://hannahferny.com/hjernelandet/${dispatch.url}`, dispatch.date])
];
writeGeneratedFile("sitemap.xml", {
  SITEMAP_URLS: sitemapUrls.map(([url, date]) => `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`).join("\n")
});

console.log(`Built ${dispatches.length} published dispatches from data/dispatches.json.`);

function numberWord(number) {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return words[number] ?? String(number);
}
