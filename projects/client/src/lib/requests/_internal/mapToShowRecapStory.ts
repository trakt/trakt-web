import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import type { ShowRecapStory } from '../models/ShowRecapStory.ts';
import type { ShowRecapStoryResponse } from '../models/ShowRecapStoryResponse.ts';
import { mapToRecapLine } from './mapToRecapLine.ts';

export function mapToShowRecapStory(
  response?: ShowRecapStoryResponse,
): ShowRecapStory | null {
  if (!response) {
    return null;
  }

  return {
    checkpoint: response.checkpoint,
    segments: response.segments.map((segment) => ({
      season: segment.season,
      text: toRelativeMarkdownLinks(segment.text, SEO_ORIGIN),
    })),
    lines: response.latest.whereThingsStand.map(mapToRecapLine),
  };
}
