#!/usr/bin/env node
/**
 * Render the link-preview card (og:image / twitter:image) to app/opengraph-image.jpg.
 *
 * The card is assets/og/card.html: the landing hero's artwork (public/images), fonts and copy at
 * 1200 x 630. It is a static JPEG rather than a generated image because the artwork's grain makes
 * a PNG close to 1 MB, and some apps skip previews that heavy.
 *
 * Usage (from client/), after changing the card, the artwork or the event dates:
 *   node scripts/render-og-image.mjs
 *
 * Requirements: Google Chrome (set CHROME_PATH if it is not at the default macOS location) and
 * sharp, which is already installed as an optional dependency of next.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const CLIENT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARD = join(CLIENT, "assets/og/card.html");
const OUT = join(CLIENT, "app/opengraph-image.jpg");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SIZE = { width: 1200, height: 630 };

const tmp = mkdtempSync(join(tmpdir(), "og-"));
try {
  const shot = join(tmp, "card.png");
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--user-data-dir=${join(tmp, "profile")}`,
      `--window-size=${SIZE.width},${SIZE.height}`,
      // Wait for the fonts and artwork before the screenshot.
      "--virtual-time-budget=5000",
      `--screenshot=${shot}`,
      pathToFileURL(CARD).href,
    ],
    { stdio: "ignore" },
  );
  const { size } = await sharp(shot).resize(SIZE).jpeg({ quality: 86, mozjpeg: true }).toFile(OUT);
  console.log(`app/opengraph-image.jpg  ${(size / 1024).toFixed(0)} KB`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
