// The sponsors section's data and the layout of its constellations (Figma "03 · Sponsors / #sponsors").
//
// To add a sponsor: put its all-white logo in public/images/sponsors as <file>.webp and add a line
// to the right list below. Nothing is placed by hand: a list of five is drawn as Cassiopeia, add a
// sixth and it becomes Cepheus, and so on (see SHAPES).

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

// Each constellation takes the shape of a real one with as many stars as it has sponsors: every
// sponsor is one star, with its logo beside it. Points are in a unit box (x across, y down) and
// `lines` joins them by index.
type Shape = { name: string; points: [number, number][]; lines: [number, number][] };
const SHAPES: Shape[] = [
  { name: "Canis Minor", points: [[0, 0.15], [1, 0.85]], lines: [[0, 1]] },
  { name: "Triangulum", points: [[0, 0.75], [0.62, 0], [1, 1]], lines: [[0, 1], [1, 2], [2, 0]] },
  { name: "Crux", points: [[0.5, 0], [0, 0.42], [1, 0.5], [0.46, 1]], lines: [[0, 3], [1, 2]] },
  { name: "Cassiopeia", points: [[0, 0.2], [0.24, 0.95], [0.5, 0.3], [0.73, 1], [1, 0]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: "Cepheus", points: [[0.5, 0], [0.12, 0.4], [0.88, 0.45], [0, 1], [1, 1], [0.5, 0.72]], lines: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 5], [5, 4]] },
  { name: "Ursa Major", points: [[0, 0.3], [0.17, 0.05], [0.34, 0.2], [0.52, 0.42], [0.95, 0], [1, 0.8], [0.6, 1]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
];
// Past seven sponsors the stars are spread along Scorpius, which is one long hooked chain.
const SCORPIUS: [number, number][] = [[0, 0.05], [0.1, 0.5], [0.24, 0.2], [0.4, 0.45], [0.54, 0.85], [0.7, 1], [0.86, 0.9], [1, 0.55], [0.93, 0.15]];

function shapeFor(count: number): Shape {
  if (count === 1) return { name: "Polaris", points: [[0.5, 0.5]], lines: [] };
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
  return { name: "Scorpius", points, lines: points.slice(1).map((_, i): [number, number] => [i, i + 1]) };
}

type Options = {
  /** How wide the constellation is, in the design's units. */
  width: number;
  /** How tall its shape is drawn; the logos above and below it get their own room on top of this. */
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

/** One try at a constellation; `tidy` says whether every logo found a clear place. */
function attempt(list: Logo[], shape: Shape, { width, shapeHeight, fit, starScale = 1 }: Options, openSide: "right" | "left" | null) {
  // The shape is drawn inside a margin wide enough for a logo to sit on any side of an outer star.
  const marginX = fit.w / 2;
  const marginY = fit.h + LOGO_GAP + 24;
  const height = shapeHeight + 2 * marginY;
  const stars: Star[] = shape.points.map(([x, y], i) => ({
    x: marginX + x * (width - 2 * marginX),
    y: marginY + y * shapeHeight,
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
  let tidy = true;
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
      x: side.x === 0 ? star.x - w / 2 : side.x > 0 ? star.x + (side.y === 0 ? reach : 6) : star.x - w - (side.y === 0 ? reach : 6),
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
    if (!side) tidy = false;
    logos.push({ ...logo, ...box(side ?? sides[0]) });
  });

  const sky: Constellation = { width, height: height + (spot ? OPEN_LANE : 0), logos, stars, lines, open: spot ?? undefined };
  return { sky, tidy };
}

export function layoutConstellation(list: Logo[], options: Options): Constellation {
  const shape = shapeFor(list.length);
  // If the logos crowd each other, draw them smaller and the shape taller until they don't.
  // The long chain needs more height than the compact shapes.
  const crowd = shape.name === "Scorpius" ? 1.6 : 1;
  let first: Constellation | undefined;
  for (const scale of [1, 0.88, 0.76, 0.64]) {
    const sized = { ...options, fit: { w: options.fit.w * scale, h: options.fit.h * scale }, shapeHeight: options.shapeHeight * (2 - scale) * crowd };
    for (const side of options.open ? (["right", "left"] as const) : [null]) {
      const { sky, tidy } = attempt(list, shape, sized, side);
      if (tidy) return sky;
      first ??= sky;
    }
  }
  return first!;
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
const NORTH = { star: { x: WIDTH / 2, y: 46, size: 84 }, logoWidth: 340, logoTop: 104 };
const MAIN = { x: 0, width: 880, shapeHeight: 170, fit: { w: 200, h: 72 } };
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
