const searchInput = document.querySelector("[data-province-search]");
const results = Array.from(document.querySelectorAll("[data-result]"));
const count = document.querySelector("[data-result-count]");
const empty = document.querySelector("[data-no-results]");

function updateSearch(){
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  results.forEach((result) => {
    const haystack = result.textContent.toLowerCase();
    const matches = haystack.includes(query);
    result.hidden = !matches;
    if(matches){
      visible += 1;
    }
  });

  count.textContent = `${visible} result${visible === 1 ? "" : "s"} in this province`;
  empty.style.display = visible === 0 ? "block" : "none";
}

if(searchInput){
  searchInput.addEventListener("input", updateSearch);
  updateSearch();
}
