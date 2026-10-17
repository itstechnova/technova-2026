// The landing page is a scaled replica of the 1512px-wide Figma frame (81:74).
export const FRAME_WIDTH = 1512;

export const fx = (px: number) => `${(px / FRAME_WIDTH) * 100}vw`;
