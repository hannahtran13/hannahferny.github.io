const objects = [
  {
    id: "anchor",
    name: "The anchor",
    image: "assets/anchor.png",
    note: "The guilt of staying still while everyone else appeared to be moving forward.",
    x: 19,
    y: 27,
    width: 21,
    rotate: -9,
  },
  {
    id: "mirror",
    name: "The broken mirror",
    image: "assets/mirror.png",
    note: "Every version of myself I compared to someone else, and found lacking.",
    x: 35,
    y: 20,
    width: 18,
    rotate: 7,
  },
  {
    id: "shell",
    name: "The shell",
    image: "assets/shell.png",
    note: "The small, stubborn belief that beauty still counted as a reason to remain.",
    x: 60,
    y: 23,
    width: 20,
    rotate: -5,
  },
  {
    id: "key",
    name: "The key",
    image: "assets/key.png",
    note: "A work permit, an unopened door, and the humiliation of having the key cut but not yet turned.",
    x: 39,
    y: 29,
    width: 14,
    rotate: 13,
  },
  {
    id: "feather",
    name: "The feather",
    image: "assets/feather.png",
    note: "All the ideas I could not carry out, each one somehow weightless and unbearably heavy.",
    x: 52,
    y: 31,
    width: 28,
    rotate: 15,
  },
  {
    id: "hourglass",
    name: "The hourglass",
    image: "assets/hourglass.png",
    note: "The month passing anyway: applications pending, bills arriving, ice melting beneath my skates.",
    x: 47,
    y: 30,
    width: 16,
    rotate: -4,
  },
  {
    id: "letter",
    name: "The letter",
    image: "assets/letter.png",
    note: "Everything I wanted to tell my mother, folded small enough to postpone sending.",
    x: 20,
    y: 49,
    width: 29,
    rotate: -11,
  },
];

const tray = document.querySelector(".tray");
const modal = document.querySelector(".modal-wrap");
const closeButton = document.querySelector(".close");
const resetButton = document.querySelector(".reset");
const noteNumber = document.querySelector(".note-number");
const noteImage = document.querySelector(".note-image");
const noteTitle = document.querySelector("#note-title");
const noteText = document.querySelector(".note-text");
let topZ = 10;
let drag = null;
let lastFocused = null;
let resetTimer = null;

function setPosition(button, x, y) {
  button.dataset.x = x;
  button.dataset.y = y;
  button.style.left = `${x}%`;
  button.style.top = `${y}%`;
}

function openNote(item, button) {
  lastFocused = button;
  noteNumber.textContent = `${String(objects.indexOf(item) + 1).padStart(2, "0")} / 07`;
  noteImage.src = item.image;
  noteTitle.textContent = item.name;
  noteText.textContent = item.note;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeNote() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocused?.focus();
}

objects.forEach((item) => {
  const button = document.createElement("button");
  const image = document.createElement("img");
  button.className = "trinket";
  button.type = "button";
  button.setAttribute("aria-label", `Open ${item.name}`);
  button.dataset.id = item.id;
  button.style.width = `${item.width}%`;
  button.style.transform = `rotate(${item.rotate}deg)`;
  image.src = item.image;
  image.alt = "";
  image.draggable = false;
  button.append(image);
  setPosition(button, item.x, item.y);

  button.addEventListener("pointerdown", (event) => {
    button.setPointerCapture(event.pointerId);
    drag = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: Number(button.dataset.x),
      startY: Number(button.dataset.y),
      moved: false,
    };
    topZ += 1;
    button.style.zIndex = topZ;
  });

  button.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bounds = tray.getBoundingClientRect();
    const dx = ((event.clientX - drag.pointerX) / bounds.width) * 100;
    const dy = ((event.clientY - drag.pointerY) / bounds.height) * 100;
    if (Math.abs(dx) + Math.abs(dy) > 0.8) drag.moved = true;
    setPosition(
      button,
      Math.max(-3, Math.min(91, drag.startX + dx)),
      Math.max(-4, Math.min(83, drag.startY + dy)),
    );
  });

  button.addEventListener("pointerup", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved) openNote(item, button);
    drag = null;
  });

  button.addEventListener("pointercancel", () => {
    drag = null;
  });

  tray.append(button);
});

resetButton.addEventListener("click", () => {
  const buttons = objects.map((item) =>
    tray.querySelector(`[data-id="${item.id}"]`),
  );

  window.clearTimeout(resetTimer);
  buttons.forEach((button) => button.classList.add("returning"));

  requestAnimationFrame(() => {
    objects.forEach((item) => {
      const button = tray.querySelector(`[data-id="${item.id}"]`);
      setPosition(button, item.x, item.y);
      button.style.zIndex = "";
    });
    topZ = 10;

    resetTimer = window.setTimeout(() => {
      buttons.forEach((button) => button.classList.remove("returning"));
    }, 700);
  });
});

closeButton.addEventListener("click", closeNote);
modal.addEventListener("pointerdown", (event) => {
  if (event.target === modal) closeNote();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNote();
});

const porcelainStory = document.querySelector(".porcelain-story");
const tileWall = document.querySelector(".tile-wall");
const porcelainCue = document.querySelector(".porcelain-cue");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let porcelainFrame = null;

function makeTiles() {
  const columns = window.innerWidth <= 760 ? 5 : 8;
  const rows = window.innerWidth <= 760 ? 11 : 5;
  const tileCount = columns * rows;
  tileWall.replaceChildren();

  for (let index = 0; index < tileCount; index += 1) {
    const tile = document.createElement("div");
    const image = document.createElement("img");
    const column = index % columns;
    const direction = column < columns / 2 ? -1 : 1;
    const variance = ((index * 37) % 19) - 9;
    tile.className = "porcelain-tile";
    image.src = `assets/gzhel-tile-0${(index % 2) + 1}.png`;
    image.alt = "";
    image.draggable = false;
    tile.append(image);
    tile.style.setProperty("--drift", `${direction * (70 + Math.abs(variance) * 7)}vw`);
    tile.style.setProperty("--drop", `${95 + ((index * 29) % 90)}vh`);
    tile.style.setProperty("--spin", `${direction * (18 + ((index * 13) % 48))}deg`);
    tile.style.setProperty("--depth", `${-40 - ((index * 17) % 180)}px`);
    tile.dataset.release = ((index * 23) % tileCount) / tileCount;
    tileWall.append(tile);
  }
}

function updatePorcelain() {
  porcelainFrame = null;
  const bounds = porcelainStory.getBoundingClientRect();
  const distance = porcelainStory.offsetHeight - window.innerHeight;
  const progress = Math.max(0, Math.min(1, -bounds.top / distance));

  tileWall.querySelectorAll(".porcelain-tile").forEach((tile) => {
    const release = Number(tile.dataset.release) * 0.42;
    const fall = Math.max(0, Math.min(1, (progress - release) / 0.58));
    const easedFall = 1 - Math.pow(1 - fall, 3);
    tile.style.setProperty("--fall", reducedMotion.matches ? (progress > 0.35 ? 1 : 0) : easedFall);
  });

  porcelainCue.style.opacity = progress > 0.12 ? "0" : "1";
}

function requestPorcelainUpdate() {
  if (porcelainFrame) return;
  porcelainFrame = requestAnimationFrame(updatePorcelain);
}

makeTiles();
updatePorcelain();
window.addEventListener("scroll", requestPorcelainUpdate, { passive: true });
window.addEventListener("resize", () => {
  makeTiles();
  requestPorcelainUpdate();
});
