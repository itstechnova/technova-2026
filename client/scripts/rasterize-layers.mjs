#!/usr/bin/env node
/**
 * Rasterize the landing-page background layers (Figma SVG exports) to WebP.
 *
 * The SVG sources in assets/layers/ are full of large feGaussianBlur/feTurbulence filters that are
 * far too expensive for the browser to re-render while the page animates, so the page ships
 * pre-rendered WebPs from public/images/ instead.
 *
 * Usage (from client/):
 *   node scripts/rasterize-layers.mjs              # all layers
 *   node scripts/rasterize-layers.mjs bg big-star  # only these layers
 *
 * Requirements:
 *   - Google Chrome installed. Layers are drawn by headless Chrome so the output matches what
 *     browsers draw today (librsvg/sharp render these filters differently). Set CHROME_PATH if
 *     Chrome is not at the default macOS location.
 *   - sharp, which is already installed as an optional dependency of next (run `npm ci` first).
 *
 * Chrome is driven over the DevTools protocol on --remote-debugging-pipe rather than a WebSocket,
 * so no extra npm packages are needed (Node 22's WebSocket also stalls on multi-MB screenshots).
 *
 * Each layer is drawn by an <img> at a multiple of its Figma frame size with a transparent
 * background, then encoded with the WebP options in LAYERS. Frame px map to 100vw / 1512, so 2x
 * matches a DPR-2 laptop at ~1512 CSS px. Nearly every layer carries Figma noise (feTurbulence),
 * which is what costs bytes, so the scale is chosen per layer by comparing the composited page
 * against the SVGs at DPR 2:
 *   - `scale` is the output size. Layers whose grain is part of the look (the planets) are drawn
 *     directly at that size, using near-lossless WebP where lossy WebP would smear the grain.
 *   - `supersample` draws the layer at 2x and downsizes it to `scale` with sharp. Use it where the
 *     noise is finer than a pixel at `scale`: drawn directly, it aliases into blotches (star cores)
 *     or shifts the tone (bg comes out ~2 levels darker at 1x than browsers draw it at DPR 2).
 *
 * bg also gets the old CSS film grain (.grain: a 160px feTurbulence tile at opacity 0.09,
 * soft-light) baked in, with the tile scaled as it looked at a 1512px-wide viewport. In Chrome
 * that overlay mostly lifted the dark bg by ~2 levels; its texture was below 1 level.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const CLIENT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(CLIENT, "assets/layers");
const OUT_DIR = join(CLIENT, "public/images");
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const lossy = (quality) => ({ quality });
const nearLossless = (quality) => ({ nearLossless: true, quality });

// scale: output size relative to the SVG's frame size. supersample: draw at 2x, then downsize.
// webp: sharp WebP options (alphaQuality defaults to 90; 80 keeps ~96 alpha levels, fine for glows).
const LAYERS = {
  bg: { scale: 1, supersample: true, webp: lossy(88), grain: true },
  "big-star": { scale: 1, webp: { ...lossy(80), alphaQuality: 80 } },
  "saturn-planet-body": { scale: 1, webp: lossy(80) },
  "saturn-planet-bands": { scale: 1, webp: lossy(80) },
  "saturn-ring": { scale: 1, webp: lossy(80) },
  "star-small": { scale: 2, webp: lossy(80) },
  // A very soft glow whose grain lossy WebP drops anyway.
  "pink-planet-halo": { scale: 0.75, supersample: true, webp: { ...lossy(60), alphaQuality: 80 } },
  "pink-planet-base": { scale: 1.5, webp: nearLossless(20) },
  // Its grain sits under the base layer's; 1x is indistinguishable once composited.
  "pink-planet-color": { scale: 1, webp: { ...lossy(80), alphaQuality: 80 } },
  "pink-planet-bands": { scale: 1.5, webp: lossy(80) },
  // Static, and its crisp rim is the planet's visible lit edge.
  "pink-planet-glint": { scale: 2, webp: lossy(80) },
  "star-med-1": { scale: 1, supersample: true, webp: lossy(85) },
  "star-med-2": { scale: 1, supersample: true, webp: lossy(85) },
  "star-med-3": { scale: 1, supersample: true, webp: lossy(85) },
  "star-med-5": { scale: 1, supersample: true, webp: lossy(85) },
  "star-med-6": { scale: 1, supersample: true, webp: lossy(85) },
  // 1.5x keeps its grain finer (about +320 KB).
  "green-planet-body": { scale: 1, webp: nearLossless(40) },
  "green-planet-bands": { scale: 1.5, webp: nearLossless(40) },
  "green-planet-spots": { scale: 1, webp: lossy(80) },
};

// The film grain that used to be a full-page CSS overlay (.grain in globals.css).
const GRAIN_TILE = 160;
const GRAIN_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

/** Starts headless Chrome and returns a minimal CDP client for one page. */
async function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), "rasterize-layers-"));
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--remote-debugging-pipe",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] },
  );
  chrome.stderr.resume();
  const killChrome = () => chrome.kill("SIGKILL");
  process.on("exit", killChrome);

  let nextId = 0;
  const pending = new Map();
  const waiters = new Set();
  let partial = [];
  chrome.stdio[4].on("data", (chunk) => {
    let start = 0;
    let end;
    while ((end = chunk.indexOf(0, start)) !== -1) {
      partial.push(chunk.subarray(start, end));
      const msg = JSON.parse(Buffer.concat(partial).toString("utf8"));
      partial = [];
      start = end + 1;
      if (msg.id !== undefined) {
        const p = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) p.reject(new Error(`${p.method}: ${msg.error.message}`));
        else p.resolve(msg.result);
      } else {
        for (const w of waiters) w(msg);
      }
    }
    if (start < chunk.length) partial.push(chunk.subarray(start));
  });
  chrome.on("exit", (code) => {
    for (const p of pending.values()) p.reject(new Error(`Chrome exited (${code})`));
    pending.clear();
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject, method });
      chrome.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + "\0");
    });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);
  await page("Page.enable");
  await page("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });

  return {
    page,
    async evaluate(expression) {
      const r = await page("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
      return r.result.value;
    },
    async setContent(html) {
      const { frameTree } = await page("Page.getFrameTree");
      await page("Page.setDocumentContent", { frameId: frameTree.frame.id, html });
    },
    async close() {
      await Promise.race([send("Browser.close").catch(() => {}), new Promise((r) => setTimeout(r, 3000))]);
      killChrome();
      rmSync(profile, { recursive: true, force: true });
    },
  };
}

function svgSize(svg) {
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const width = Number(root.match(/\swidth="([\d.]+)"/)?.[1]);
  const height = Number(root.match(/\sheight="([\d.]+)"/)?.[1]);
  if (!width || !height) throw new Error("SVG root needs numeric width/height");
  return { width, height };
}

/** Renders one SVG through an <img> at width x height device px and returns a PNG buffer. */
async function renderLayer(chrome, svg, width, height, grainTilePx) {
  await chrome.page("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  await chrome.setContent(
    `<!doctype html><html><head><style>
      html, body { margin: 0; background: transparent; }
      .frame { position: relative; width: ${width}px; height: ${height}px; overflow: hidden; }
      .frame img { display: block; width: 100%; height: 100%; }
      .grain {
        position: absolute; inset: 0; opacity: 0.09; mix-blend-mode: soft-light;
        background-image: url("${GRAIN_URL}"); background-size: ${grainTilePx}px ${grainTilePx}px;
      }
    </style></head><body><div class="frame">
      <img id="layer" src="${src}">${grainTilePx ? '<div class="grain"></div>' : ""}
    </div></body></html>`,
  );
  // Wait for the layer and (via the shared image cache) the grain tile before painting.
  await chrome.evaluate(`(async () => {
    await document.getElementById("layer").decode();
    ${grainTilePx ? `const grain = new Image(); grain.src = ${JSON.stringify(GRAIN_URL)}; await grain.decode();` : ""}
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  })()`);
  const { data } = await chrome.page("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  return Buffer.from(data, "base64");
}

const requested = process.argv.slice(2);
const sources = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => basename(f, ".svg"))
  .filter((name) => !requested.length || requested.includes(name));
for (const name of requested) if (!sources.includes(name)) throw new Error(`No assets/layers/${name}.svg`);

const chrome = await launchChrome();
let total = 0;
try {
  for (const name of sources) {
    const config = LAYERS[name];
    if (!config) throw new Error(`Add ${name} to LAYERS in scripts/rasterize-layers.mjs`);
    const svg = readFileSync(join(SRC_DIR, `${name}.svg`), "utf8");
    const size = svgSize(svg);
    const width = Math.round(size.width * config.scale);
    const height = Math.round(size.height * config.scale);
    const drawScale = config.supersample ? 2 : config.scale;
    const drawWidth = Math.round(size.width * drawScale);
    const drawHeight = Math.round(size.height * drawScale);
    const grainTilePx = config.grain ? GRAIN_TILE * (drawWidth / size.width) : 0;
    const png = await renderLayer(chrome, svg, drawWidth, drawHeight, grainTilePx);
    let image = sharp(png);
    const drawn = await image.metadata();
    if (drawn.width !== drawWidth || drawn.height !== drawHeight) {
      throw new Error(`${name}: expected ${drawWidth}x${drawHeight}, Chrome produced ${drawn.width}x${drawn.height}`);
    }
    if (drawWidth !== width || drawHeight !== height) {
      image = image.resize(width, height, { fit: "fill", kernel: "lanczos3" });
    }
    const out = join(OUT_DIR, `${name}.webp`);
    const info = await image
      .webp({ effort: 6, smartSubsample: true, alphaQuality: 90, ...config.webp })
      .toFile(out);
    total += info.size;
    console.log(`${name.padEnd(20)} ${`${width}x${height}`.padEnd(10)} ${(info.size / 1024).toFixed(0).padStart(5)} KB`);
  }
} finally {
  await chrome.close();
}
console.log(`${"total".padEnd(31)} ${(total / 1024).toFixed(0).padStart(5)} KB`);
