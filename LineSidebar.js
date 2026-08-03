(function () {
  const falloff = proximity => proximity * proximity * (3 - 2 * proximity);

  window.mountLineSidebar = function mountLineSidebar(source, options = {}) {
    if (!source || source.dataset.lineSidebarMounted) return;
    source.dataset.lineSidebarMounted = "true";
    source.classList.add("line-sidebar-source");

    const labels = [...source.children].map(item => item.textContent.trim());
    const nav = document.createElement("nav");
    nav.className = "line-sidebar";
    nav.setAttribute("aria-label", options.ariaLabel || "Portfolio contents");
    const list = document.createElement("ol");
    list.className = "line-sidebar__list";
    nav.append(list);

    const items = labels.map((label, index) => {
      const item = document.createElement("li");
      item.className = "line-sidebar__item";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "line-sidebar__button";
      button.innerHTML = `<span class="line-sidebar__marker" aria-hidden="true"></span><span class="line-sidebar__label"><span class="line-sidebar__index">${String(index + 1).padStart(2, "0")}</span><span>${label.replace(/^\d+\s*/, "")}</span></span>`;
      button.addEventListener("click", () => {
        items.forEach(entry => entry.removeAttribute("aria-current"));
        item.setAttribute("aria-current", "true");
        options.onItemClick?.(index, label);
      });
      item.append(button);
      list.append(item);
      return item;
    });

    source.after(nav);
    let frame = 0;
    let pointerY = null;
    const render = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const center = itemRect.top - rect.top + itemRect.height / 2;
        const distance = pointerY == null ? Infinity : Math.abs(pointerY - center);
        const effect = falloff(Math.max(0, 1 - distance / (options.proximityRadius || 86)));
        if (!item.hasAttribute("aria-current")) item.style.setProperty("--effect", effect.toFixed(4));
      });
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
    list.addEventListener("pointermove", event => {
      pointerY = event.clientY - list.getBoundingClientRect().top;
      requestRender();
    });
    list.addEventListener("pointerleave", () => { pointerY = null; requestRender(); });
  };
})();
