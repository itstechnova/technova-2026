// The sponsors section's data and the layout of its constellations (Figma "03 · Sponsors / #sponsors").
//
// To add a sponsor: put its all-white logo in public/images/sponsors as <file>.webp and add a line
// to the right list below. Nothing is placed by hand: a list of five is drawn as Cepheus, add a
// sixth and it becomes Cygnus, and so on (see SHAPES).

/** A logo file under public/images/sponsors; `width`/`height` are the image file's size. */
export type Logo = { name: string; file: string; width: number; height: number };

/** The gold sponsor: the north star, on its own above the constellations. */
export const NORTH_STAR: Logo = { name: "Mintlify", file: "mintlify", width: 439, height: 98 };

/** The main constellation. */
export const SPONSORS: Logo[] = [
  { name: "Jane Street", file: "jane-street", width: 560, height: 149 },
  { name: "Accenture", file: "accenture", width: 457, height: 120 },
  { name: "Scotiabank", file: "scotiabank", width: 474, height: 68 },
  { name: "Shopify", file: "shopify", width: 440, height: 127 },
  { name: "Ubisoft", file: "ubisoft", width: 300, height: 275 },
];

/** The smaller constellation beside it. */
export const SMALL_SPONSORS: Logo[] = [
  { name: "Wealthsimple", file: "wealthsimple", width: 560, height: 91 },
  { name: "Saily", file: "saily", width: 300, height: 130 },
];

export type Placed = Logo & { x: number; y: number; w: number; h: number };
export type Star = { x: number; y: number; size: number };
export type Line = { x1: number; y1: number; x2: number; y2: number; dashed?: boolean };
export type Point = { x: number; y: number };
export type Constellation = { width: number; height: number; logos: Placed[]; stars: Star[]; lines: Line[]; open?: Point };

// Each constellation is a real one with as many stars as it has sponsors: every sponsor is one of
// its stars, with its logo beside it. The points are the stars' true positions in the sky (right
// ascension and declination, projected flat and turned to sit well on the page), scaled so the
// longer side is 1; `lines` joins them by index, the way the figure is usually drawn.
type Shape = { name: string; width: number; height: number; points: [number, number][]; lines: [number, number][] };
const SHAPES: Shape[] = [
  // Procyon, Gomeisa
  { name: "Canis Minor", width: 1.0, height: 0.48, points: [[0.0, 0.48], [1.0, 0.0]], lines: [[0, 1]] },
  // Mothallah, Beta Trianguli, Gamma Trianguli
  { name: "Triangulum", width: 1.0, height: 0.284, points: [[0.0, 0.008], [0.92, 0.284], [1.0, 0.0]], lines: [[0, 1], [1, 2], [2, 0]] },
  // Gacrux, Mimosa, Acrux, Imai
  { name: "Crux", width: 0.695, height: 1.0, points: [[0.345, 0.0], [0.0, 0.443], [0.436, 1.0], [0.695, 0.283]], lines: [[0, 2], [1, 3]] },
  // Errai, Alfirk, Alderamin, Zeta Cephei, Iota Cephei
  { name: "Cepheus", width: 1.0, height: 0.404, points: [[0.0, 0.256], [0.474, 0.0], [0.862, 0.003], [1.0, 0.353], [0.561, 0.404]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4]] },
  // Deneb, Sadr, Aljanah, Fawaris, Eta Cygni, Albireo
  { name: "Cygnus", width: 1.0, height: 0.708, points: [[1.0, 0.237], [0.71, 0.323], [0.492, 0.0], [0.861, 0.708], [0.398, 0.501], [0.0, 0.696]], lines: [[0, 1], [1, 2], [1, 3], [1, 4], [4, 5]] },
  // Alkaid, Mizar, Alioth, Megrez, Dubhe, Merak, Phecda
  { name: "Ursa Major", width: 1.0, height: 0.48, points: [[0.0, 0.48], [0.201, 0.296], [0.377, 0.282], [0.593, 0.248], [0.926, 0.0], [1.0, 0.206], [0.726, 0.373]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
];
// Past seven sponsors the stars are spread along a hooked chain in the manner of Scorpius; this one
// is a sketch, not a star-for-star map.
const SCORPIUS: [number, number][] = [[0, 0.02], [0.1, 0.22], [0.24, 0.09], [0.4, 0.2], [0.54, 0.38], [0.7, 0.45], [0.86, 0.4], [1, 0.25], [0.93, 0.07]];

function shapeFor(count: number): Shape {
  if (count === 1) return { name: "Polaris", width: 1, height: 1, points: [[0.5, 0.5]], lines: [] };
  const shape = SHAPES.find(({ points }) => points.length === count);
  if (shape) return shape;
  // Walk the chain and drop `count` stars along it, evenly spaced.
  const lengths = SCORPIUS.slice(1).map(([x, y], i) => Math.hypot(x - SCORPIUS[i][0], y - SCORPIUS[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const points: [number, number][] = [];
  for (let n = 0; n < count; n++) {
    let along = (total * n) / (count - 1);
    let i = 0;
    while (i < lengths.length - 1 && along > lengths[i]) along -= lengths[i++];
    const t = along / lengths[i];
    points.push([SCORPIUS[i][0] + (SCORPIUS[i + 1][0] - SCORPIUS[i][0]) * t, SCORPIUS[i][1] + (SCORPIUS[i + 1][1] - SCORPIUS[i][1]) * t]);
  }
  return { name: "Scorpius", width: 1, height: 0.45, points, lines: points.slice(1).map((_, i): [number, number] => [i, i + 1]) };
}

type Options = {
  /** How wide the constellation is, in the design's units. */
  width: number;
  /** The most height its shape may take; the logos above and below it get their own room on top of this. */
  shapeHeight: number;
  /** The largest box a logo may fill; each logo keeps its own proportions inside it. */
  fit: { w: number; h: number };
  /** Shrinks or grows the stars. */
  starScale?: number;
  /** Ends the constellation with the dashed open star: the place for the next sponsor. */
  open?: boolean;
};

const STAR_SIZES = [38, 30, 44, 32, 40, 28, 36];
const LOGO_GAP = 12; // between a star and its logo
const CLEARANCE = 10; // how far a logo keeps from the lines, the other stars and the other logos
const OPEN_LANE = 84; // room under the shape for the open star and its caption

// Where a logo can sit around its star, as a direction from the star.
const SIDES: Point[] = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
];

type Box = { x: number; y: number; w: number; h: number };
const inside = (point: Point, box: Box, pad: number) => point.x > box.x - pad && point.x < box.x + box.w + pad && point.y > box.y - pad && point.y < box.y + box.h + pad;
const crosses = (line: Line, box: Box, pad: number) => {
  for (let step = 0; step <= 64; step++) {
    if (inside({ x: line.x1 + ((line.x2 - line.x1) * step) / 64, y: line.y1 + ((line.y2 - line.y1) * step) / 64 }, box, pad)) return true;
  }
  return false;
};
const overlap = (a: Box, b: Box, pad: number) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** One try at a constellation; `misfits` counts the logos that found no clear place. */
function attempt(list: Logo[], shape: Shape, { width, shapeHeight, fit, starScale = 1 }: Options, openSide: "right" | "left" | null) {
  // The shape is drawn inside a margin wide enough for a logo to sit on any side of an outer star.
  const marginX = Math.min(fit.w * 0.9, width * 0.2);
  const marginY = fit.h + LOGO_GAP + 24;
  // The shape keeps its true proportions: it is scaled to fit the room, never stretched.
  const scale = Math.min((width - 2 * marginX) / shape.width, shapeHeight / shape.height);
  const left = (width - shape.width * scale) / 2;
  const height = shape.height * scale + 2 * marginY;
  const stars: Star[] = shape.points.map(([x, y], i) => ({
    x: left + x * scale,
    y: marginY + y * scale,
    size: STAR_SIZES[i % STAR_SIZES.length] * starScale,
  }));
  const lines: Line[] = shape.lines.map(([from, to]) => ({ x1: stars[from].x, y1: stars[from].y, x2: stars[to].x, y2: stars[to].y }));

  // The open star hangs under the shape, tied to the star most nearly above it. It is drawn in before the logos
  // so that they keep clear of its dashed line.
  const spot = openSide && { x: openSide === "right" ? width - 98 : 98, y: height + 26 };
  if (spot) {
    const from = [...stars].sort((a, b) => Math.abs(spot.x - a.x) - Math.abs(spot.x - b.x))[0];
    lines.push({ x1: from.x, y1: from.y, x2: spot.x, y2: spot.y, dashed: true });
  }

  const logos: Placed[] = [];
  let misfits = 0;
  list.forEach((logo, i) => {
    const star = stars[i];
    const w = Math.min(fit.w, (fit.h * logo.width) / logo.height);
    const h = (w * logo.height) / logo.width;
    const reach = star.size / 2 + LOGO_GAP;
    // Which way the star's own lines leave it: the logo goes on the far side where it can.
    const pull = { x: 0, y: 0 };
    shape.lines.forEach(([from, to]) => {
      const other = from === i ? stars[to] : to === i ? stars[from] : null;
      if (!other) return;
      const length = distance(star, other) || 1;
      pull.x += (other.x - star.x) / length;
      pull.y += (other.y - star.y) / length;
    });
    const box = (side: Point): Box => ({
      x: side.x === 0 ? star.x - w / 2 : side.x > 0 ? star.x + (side.y === 0 ? reach : -24) : star.x - w - (side.y === 0 ? reach : -24),
      y: side.y === 0 ? star.y - h / 2 : side.y > 0 ? star.y + reach : star.y - reach - h,
      w,
      h,
    });
    const fits = (candidate: Box) =>
      candidate.x > -1 &&
      candidate.x + w < width + 1 &&
      candidate.y > -1 &&
      candidate.y + h < height + 1 &&
      !lines.some((line) => crosses(line, candidate, CLEARANCE)) &&
      !stars.some((other, j) => j !== i && inside(other, candidate, CLEARANCE + other.size / 2)) &&
      !logos.some((placed) => overlap(placed, candidate, CLEARANCE));
    // Straight above or below reads best, so those sides get a head start.
    const score = (side: Point) => -(side.x * pull.x + side.y * pull.y) / Math.hypot(side.x, side.y) + (side.x === 0 ? 0.6 : side.y === 0 ? 0 : -0.2);
    const sides = [...SIDES].sort((a, b) => score(b) - score(a));
    const side = sides.find((candidate) => fits(box(candidate)));
    if (!side) misfits++;
    logos.push({ ...logo, ...box(side ?? sides[0]) });
  });

  const sky: Constellation = { width, height: height + (spot ? OPEN_LANE : 0), logos, stars, lines, open: spot ?? undefined };
  return { sky, misfits };
}

export function layoutConstellation(list: Logo[], options: Options): Constellation {
  const shape = shapeFor(list.length);
  // If the logos crowd each other, draw them smaller until they don't.
  // The long chain needs more height than the compact shapes.
  const crowd = shape.name === "Scorpius" ? 1.6 : 1;
  let best: { sky: Constellation; misfits: number } | undefined;
  for (const scale of [1, 0.88, 0.76, 0.64, 0.52]) {
    const sized = { ...options, fit: { w: options.fit.w * scale, h: options.fit.h * scale }, shapeHeight: options.shapeHeight * crowd };
    for (const side of options.open ? (["right", "left"] as const) : [null]) {
      const tried = attempt(list, shape, sized, side);
      if (!tried.misfits) return tried.sky;
      if (!best || tried.misfits < best.misfits) best = tried;
    }
  }
  return best!.sky;
}

/** Moves a constellation to its place in the whole sky. */
function at(sky: Constellation, dx: number, dy: number): Constellation {
  return {
    ...sky,
    logos: sky.logos.map((logo) => ({ ...logo, x: logo.x + dx, y: logo.y + dy })),
    stars: sky.stars.map((star) => ({ ...star, x: star.x + dx, y: star.y + dy })),
    lines: sky.lines.map((line) => ({ ...line, x1: line.x1 + dx, y1: line.y1 + dy, x2: line.x2 + dx, y2: line.y2 + dy })),
    open: sky.open && { x: sky.open.x + dx, y: sky.open.y + dy },
  };
}

// The whole sky, in the design's 1248-wide units: the north star at the top, the main constellation
// under it on the left and the smaller one on the right, a little lower.
const WIDTH = 1248;
const NORTH = { star: { x: WIDTH / 2, y: 48, size: 96 }, logoWidth: 340, logoTop: 118 };
const MAIN = { x: 0, width: 880, shapeHeight: 230, fit: { w: 200, h: 72 } };
const SMALL = { x: 930, width: 318, shapeHeight: 90, fit: { w: 160, h: 46 }, drop: 28 };

export function layoutSponsors() {
  const northHeight = (NORTH.logoWidth * NORTH_STAR.height) / NORTH_STAR.width;
  const north: Placed = { ...NORTH_STAR, x: (WIDTH - NORTH.logoWidth) / 2, y: NORTH.logoTop, w: NORTH.logoWidth, h: northHeight };
  const top = NORTH.logoTop + northHeight + 34;
  const main = at(layoutConstellation(SPONSORS, MAIN), MAIN.x, top);
  const small = at(layoutConstellation(SMALL_SPONSORS, { ...SMALL, starScale: 0.75, open: true }), SMALL.x, top + SMALL.drop);
  return {
    width: WIDTH,
    height: Math.max(top + main.height, top + SMALL.drop + small.height),
    north: { star: NORTH.star, logo: north },
    logos: [...main.logos, ...small.logos],
    stars: [...main.stars, ...small.stars],
    lines: [...main.lines, ...small.lines],
    open: small.open!,
  };
}
