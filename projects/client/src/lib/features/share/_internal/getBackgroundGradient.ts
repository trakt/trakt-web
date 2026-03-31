import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { blendColors } from '$lib/utils/color/blendColors.ts';

const gradientStartDefault = '#000000';
const gradientEndDefault = '#1b2b36';
const gradientColorWeight = 0.2;

// Since Satori doesn't support color-mix, we blend manually
export function getBackgroundGradient(media: MediaEntry) {
  if (!media.colors) {
    return {
      gradientStart: gradientStartDefault,
      gradientEnd: gradientEndDefault,
    };
  }

  const gradientStart = blendColors(
    gradientStartDefault,
    media.colors[0],
    gradientColorWeight,
  );
  const gradientEnd = blendColors(
    gradientEndDefault,
    media.colors[1],
    gradientColorWeight,
  );

  return {
    gradientStart,
    gradientEnd,
  };
}
