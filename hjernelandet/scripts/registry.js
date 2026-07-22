import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const provinceNames = {
  "land-climate": "Land & Climate",
  "cities-motion": "Cities & Motion",
  language: "Language",
  life: "Life"
};
export const provinceCodes = {
  "land-climate": "land",
  "cities-motion": "cities",
  language: "language",
  life: "life"
};
export const provinceFallbacks = {
  "land-climate": "hero-landscape.png",
  "cities-motion": "articles/dispatch-02/hero-landscape.png",
  language: "topography.png",
  life: "articles/dispatch-04/hero-landscape.png"
};

export function readDispatches() {
  return JSON.parse(fs.readFileSync(path.join(root, "data/dispatches.json"), "utf8"));
}

export function validateDispatches(records) {
  const errors = [];
  const required = ["number", "code", "slug", "title", "description", "province", "location", "date", "volume", "readingTime", "imageAlt", "url"];
  for (const [index, record] of records.entries()) {
    for (const field of required) if (record[field] === undefined || record[field] === "") errors.push(`Record ${index + 1} is missing ${field}.`);
    if (!provinceNames[record.province]) errors.push(`Record ${index + 1} has unknown province: ${record.province}.`);
    if (!Number.isInteger(record.number) || record.number < 1) errors.push(`Record ${index + 1} has an invalid number.`);
    if (!Number.isInteger(record.readingTime) || record.readingTime < 1) errors.push(`Record ${index + 1} has an invalid readingTime.`);
    if (Number.isNaN(Date.parse(record.date))) errors.push(`Record ${index + 1} has an invalid date.`);
  }
  for (const field of ["number", "code", "slug", "url"]) {
    const seen = new Set();
    for (const record of records) {
      if (seen.has(record[field])) errors.push(`Duplicate ${field}: ${record[field]}.`);
      seen.add(record[field]);
    }
  }
  const featured = records.filter((record) => record.published && record.featured);
  if (featured.length > 1) errors.push(`Only one published dispatch may be featured; found ${featured.length}.`);
  for (const record of records.filter((item) => item.published)) {
    const page = path.join(root, record.url, "index.html");
    if (!fs.existsSync(page)) errors.push(`Missing article page for ${record.code}: ${record.url}.`);
    const image = dispatchImage(record);
    if (!fs.existsSync(path.join(root, image))) errors.push(`Missing image for ${record.code}: ${image}.`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return records;
}

export function dispatchImage(record) {
  return record.image || provinceFallbacks[record.province];
}

export function publishedDispatches(records) {
  return records.filter((record) => record.published).sort((a, b) => new Date(b.date) - new Date(a.date) || b.number - a.number);
}

export function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function paddedNumber(value, width = 3) {
  return String(value).padStart(width, "0");
}

export function replaceRegion(html, region, content) {
  const start = `<!-- GENERATED:${region}:START -->`;
  const end = `<!-- GENERATED:${region}:END -->`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (!pattern.test(html)) throw new Error(`Could not find generated region: ${region}`);
  return html.replace(pattern, `${start}\n${content}\n${end}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
