const dispatches = [
  { id: "001", registryId: "HL-LC-001", title: "The Environmentalism Gettysburg Doesn't Talk About", province: "land-climate", provinceLabel: "Land & Climate", location: "Adams County, PA", readingTime: 8, volume: "01", date: "July 2026", image: "hero-landscape.png", url: "articles/dispatch-01/" },
  { id: "002", registryId: "HL-CM-002", title: "Everyone Drives. Everyone Drives Something Enormous.", province: "cities-motion", provinceLabel: "Cities & Motion", location: "Adams County, PA", readingTime: 9, volume: "01", date: "July 2026", image: "articles/dispatch-02/hero-landscape.png", url: "articles/dispatch-02/" },
  { id: "003", registryId: "HL-LC-003", title: "The Fresh Food Desert Inside the Orchard", province: "land-climate", provinceLabel: "Land & Climate", location: "Orrtanna, PA", readingTime: 7, volume: "01", date: "July 2026", image: "articles/dispatch-03/hero-landscape.png", url: "articles/dispatch-03/" },
  { id: "004", registryId: "HL-LF-004", title: "I Thought I Needed a Third Place. Turns Out, I Needed to Take Root.", province: "life", provinceLabel: "Life", location: "Hagerstown, MD", readingTime: 7, volume: "01", date: "July 2026", image: "articles/dispatch-04/hero-landscape.png", url: "articles/dispatch-04/" }
];

const provinces = ["land-climate", "cities-motion", "language", "life"];
const records = new Map(Array.from(document.querySelectorAll("[data-record-id]")).map((record) => [record.dataset.recordId, record]));
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

document.querySelector("[data-total-dispatches]").textContent = String(dispatches.length).padStart(3, "0");
document.querySelector("[data-total-provinces]").textContent = String(provinces.length).padStart(3, "0");

function updateArchive({ updateUrl = true } = {}) {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;

  dispatches.forEach((dispatch) => {
    const provinceMatch = selectedProvince === "all" || dispatch.province === selectedProvince;
    const searchText = `${dispatch.title} ${dispatch.provinceLabel} ${dispatch.location}`.toLocaleLowerCase();
    const matches = provinceMatch && searchText.includes(query);
    records.get(dispatch.id).hidden = !matches;
    if (matches) visible += 1;
  });

  const orderedDispatches = [...dispatches].sort((a, b) => {
    if (sort.value === "alphabetical") return a.title.localeCompare(b.title);
    return Number(a.id) - Number(b.id);
  });
  orderedDispatches.forEach((dispatch) => recordsContainer.append(records.get(dispatch.id)));

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
