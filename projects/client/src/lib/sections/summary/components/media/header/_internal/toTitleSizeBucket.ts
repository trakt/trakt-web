/**
 * The revamped summary header sizes its title by *title length*, not viewport
 * width - a `clamp()` on `cqi`/`vw` (what {@link ResponsiveTitle} does) cannot
 * express this, because the variable is how many characters have to fit, not
 * how much room there is.
 *
 * Thresholds come from the design contract:
 * | length    | anchored   | masthead   |
 * | --------- | ---------- | ---------- |
 * | <= 28     | 64px/1.02  | 68px/1.03  |
 * | 29 - 55   | 54px/1.03  | 58px/1.04  |
 * | > 55      | 44px/1.04  | 48px/1.05  |
 *
 * The bucket is returned as a token so both directions can map it to their own
 * size step in CSS, instead of hard-coding pixel values in the component.
 */
export type TitleSizeBucket = 'large' | 'medium' | 'small';

const LARGE_MAX_LENGTH = 28;
const MEDIUM_MAX_LENGTH = 55;

export function toTitleSizeBucket(title: string): TitleSizeBucket {
  const length = title.trim().length;

  if (length <= LARGE_MAX_LENGTH) {
    return 'large';
  }

  if (length <= MEDIUM_MAX_LENGTH) {
    return 'medium';
  }

  return 'small';
}
