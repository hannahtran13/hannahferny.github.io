const provinces = ["land-climate", "cities-motion", "language", "life"];
const recordElements = Array.from(document.querySelectorAll("[data-record-id]"));
const search = document.querySelector("#archive-search");
const sort = document.querySelector("#archive-sort");
const recordsContainer = document.querySelector(".records");
const buttons = Array.from(document.querySelectorAll("[data-province]"));
const summary = document.querySelector("#result-summary");
const emptyState = document.querySelector("[data-empty-state]");
const emptyHeading = document.querySelector("[data-empty-heading]");
const emptyCopy = document.querySelector("[data-empty-copy]");
const endRecord = document.querySelector("[data-end-record]");
let selectedProvince = "all";

function updateArchive({ updateUrl = true } = {}) {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;

  recordElements.forEach((record) => {
    const provinceMatch = selectedProvince === "all" || record.dataset.province === selectedProvince;
    const searchText = `${record.dataset.recordId} ${record.dataset.title} ${record.dataset.location} ${record.textContent}`.toLocaleLowerCase();
    const matches = provinceMatch && searchText.includes(query);
    record.hidden = !matches;
    if (matches) visible += 1;
  });

  const orderedRecords = [...recordElements].sort((a, b) => {
    if (sort.value === "alphabetical") return a.dataset.title.localeCompare(b.dataset.title);
    return Number(a.dataset.recordId) - Number(b.dataset.recordId);
  });
  orderedRecords.forEach((record) => recordsContainer.append(record));

  summary.textContent = visible === 0 ? "No dispatches found" : `${visible} dispatch${visible === 1 ? "" : "es"} shown`;
  emptyState.hidden = visible !== 0;
  endRecord.hidden = visible === 0;

  if (visible === 0 && selectedProvince === "language" && !query) {
    emptyHeading.textContent = "No dispatches filed from this province yet.";
    emptyCopy.textContent = "Reports from Language remain somewhere in the interior.";
  } else {
    emptyHeading.textContent = "No dispatches found.";
    emptyCopy.textContent = "Try a broader search or return to the complete registry.";
  }

  if (updateUrl) {
    const params = new URLSearchParams();
    if (selectedProvince !== "all") params.set("province", selectedProvince);
    if (search.value.trim()) params.set("q", search.value.trim());
    if (sort.value !== "numeric") params.set("sort", sort.value);
    const nextUrl = `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`;
    history.replaceState(null, "", nextUrl);
  }
}

function setProvince(province, options) {
  selectedProvince = provinces.includes(province) ? province : "all";
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.province === selectedProvince)));
  updateArchive(options);
}

buttons.forEach((button) => button.addEventListener("click", () => setProvince(button.dataset.province)));
search.addEventListener("input", () => updateArchive());
sort.addEventListener("change", () => updateArchive());
document.querySelector("[data-reset]").addEventListener("click", () => {
  search.value = "";
  setProvince("all");
  document.querySelector('[data-province="all"]').focus();
});

const initialParams = new URLSearchParams(location.search);
search.value = initialParams.get("q") || "";
sort.value = initialParams.get("sort") === "alphabetical" ? "alphabetical" : "numeric";
setProvince(initialParams.get("province") || "all", { updateUrl: false });
