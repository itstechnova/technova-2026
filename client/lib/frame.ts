// The landing page is a scaled replica of the 1512px-wide Figma frame (81:74) on tablets and up.
export const FRAME_WIDTH = 1512;
export const FRAME_HEIGHT = 2761;

// Below the breakpoint the same artwork is re-arranged into a tall, narrow frame designed at
// 390 CSS px wide (an iPhone), scaled to the screen width like the desktop frame. Its units are
// "mobile px": 1 mobile px = 1 CSS px on a 390px-wide phone.
export const MOBILE_FRAME_WIDTH = 390;
export const MOBILE_FRAME_HEIGHT = 2190;

// Mobile px per Figma px for artwork at depth scale 1: the art is drawn ~1.7x larger than the
// desktop page squeezed onto a 390px phone would show it (390 / 1512 ≈ 0.26).
export const MOBILE_ART_SCALE = 0.44;

// Tailwind's `max-md` (48rem). globals.css uses the same query for the mobile layout.
export const MOBILE_QUERY = "(width < 48rem)";

// Positions are in frame px of the current layout and become lengths in globals.css via
// `--u` = 100cqw / frame width. `cqw` is relative to the frame's own width (the <main> is an
// inline-size container), not the viewport: `vw` counts a classic scrollbar, so vertical positions
// drifted ~1% below the %-sized layers and the frame ended ~27px past the artwork.
