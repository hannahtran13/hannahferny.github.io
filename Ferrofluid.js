const { Renderer, Program, Mesh, Triangle } = window.OGL || window.ogl;

const MAX_COLORS = 8;

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;
uniform vec3 uColor7;
uniform int uColorCount;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
varying vec2 vUv;
#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;
  float spd = 200.0 * uSpeed;
  float t = iTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));
  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }
  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);
  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 outc = palette(h) * ltn;
  float a = clamp(ltn, 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}`;

const hexToRGB = hex => {
  const value = hex.replace("#", "").padEnd(6, "0");
  return [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16) / 255);
};

const prepColors = input => {
  const base = (input?.length ? input : ["#ffffff"]).slice(0, MAX_COLORS);
  const colors = Array.from({ length: MAX_COLORS }, (_, index) => hexToRGB(base[Math.min(index, base.length - 1)]));
  return { colors, count: base.length };
};

const flowVec = direction => ({ up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0] })[direction] || [0, -1];

const ensureStyles = () => {
  if (document.querySelector('link[data-ferrofluid]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "Ferrofluid.css";
  link.dataset.ferrofluid = "";
  document.head.append(link);
};

function mountFerrofluid(container, options = {}) {
  if (!container || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  ensureStyles();
  const settings = {
    colors: ["#050505", "#111111", "#000000"], backgroundColor: "#deddd9", speed: 0.5, scale: 1,
    turbulence: 1, fluidity: 0.1, rimWidth: 0.2, sharpness: 3,
    shimmer: 1, glow: 2, flowDirection: "down", opacity: 0.82,
    mouseInteraction: true, mouseStrength: 1, mouseRadius: 0.3,
    mouseDampening: 0.15, dpr: Math.min(devicePixelRatio || 1, 2), ...options
  };
  const root = document.createElement("div");
  root.className = "ferrofluid-container";
  root.setAttribute("aria-hidden", "true");
  root.style.backgroundColor = settings.backgroundColor;
  container.prepend(root);

  let renderer;
  try { renderer = new Renderer({ dpr: settings.dpr, alpha: true, antialias: true }); }
  catch { root.remove(); return () => {}; }
  const gl = renderer.gl;
  const canvas = gl.canvas;
  gl.clearColor(0, 0, 0, 0);
  root.append(canvas);
  const { colors, count } = prepColors(settings.colors);
  const uniforms = {
    iResolution: { value: [1, 1, 1] }, iMouse: { value: [0, 0] }, iTime: { value: 0 },
    uColor0: { value: colors[0] }, uColor1: { value: colors[1] }, uColor2: { value: colors[2] },
    uColor3: { value: colors[3] }, uColor4: { value: colors[4] }, uColor5: { value: colors[5] },
    uColor6: { value: colors[6] }, uColor7: { value: colors[7] }, uColorCount: { value: count },
    uFlow: { value: flowVec(settings.flowDirection) }, uSpeed: { value: settings.speed },
    uScale: { value: settings.scale }, uTurbulence: { value: settings.turbulence },
    uFluidity: { value: settings.fluidity }, uRimWidth: { value: settings.rimWidth },
    uSharpness: { value: settings.sharpness }, uShimmer: { value: settings.shimmer },
    uGlow: { value: settings.glow }, uOpacity: { value: settings.opacity },
    uMouseEnabled: { value: settings.mouseInteraction ? 1 : 0 },
    uMouseStrength: { value: settings.mouseStrength }, uMouseRadius: { value: settings.mouseRadius }
  };
  const program = new Program(gl, { vertex, fragment, uniforms });
  const geometry = new Triangle(gl);
  const mesh = new Mesh(gl, { geometry, program });
  const target = [0, 0];
  let raf = 0, last = 0, visible = true;
  const resize = () => {
    const rect = root.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
    uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
  };
  const pointer = event => {
    const rect = root.getBoundingClientRect(), scale = renderer.dpr || 1;
    target[0] = (event.clientX - rect.left) * scale;
    target[1] = (rect.height - (event.clientY - rect.top)) * scale;
  };
  const setPalette = event => {
    const detail = event.detail || {};
    if (detail.backgroundColor) {
      root.style.backgroundColor = detail.backgroundColor;
    }
    if (detail.colors?.length) {
      const next = prepColors(detail.colors);
      for (let index = 0; index < MAX_COLORS; index++) {
        uniforms[`uColor${index}`].value = next.colors[index];
      }
      uniforms.uColorCount.value = next.count;
    }
  };
  const loop = time => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const dt = last ? (time - last) / 1000 : 0; last = time;
    const factor = settings.mouseDampening <= 0 ? 1 : 1 - Math.exp(-dt / Math.max(0.0001, settings.mouseDampening));
    uniforms.iMouse.value[0] += (target[0] - uniforms.iMouse.value[0]) * factor;
    uniforms.iMouse.value[1] += (target[1] - uniforms.iMouse.value[1]) * factor;
    uniforms.iTime.value = time * 0.001;
    renderer.render({ scene: mesh });
    root.classList.add("is-ready");
  };
  const ro = new ResizeObserver(resize);
  const io = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; });
  resize(); ro.observe(root); io.observe(root);
  if (settings.mouseInteraction) document.addEventListener("pointermove", pointer, { passive: true });
  addEventListener("ferrofluid:palette", setPalette);
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    document.removeEventListener("pointermove", pointer);
    removeEventListener("ferrofluid:palette", setPalette);
    root.remove();
  };
}

window.mountFerrofluid = mountFerrofluid;
