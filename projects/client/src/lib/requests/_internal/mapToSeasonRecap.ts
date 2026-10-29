import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { SeasonRecap } from '../models/SeasonRecap.ts';
import type { SeasonRecapResponse } from '../models/SeasonRecapResponse.ts';
import { mapToRecapLine } from './mapToRecapLine.ts';
import { toRecapChapters } from './toRecapChapters.ts';

function toRelative(text: string) {
  return toRelativeMarkdownLinks(text, SEO_ORIGIN);
}

export function mapToSeasonRecap(
  response?: SeasonRecapResponse,
): SeasonRecap | null {
  if (!response) {
    return null;
  }

  return {
    season: response.season,
    summary: toRelative(response.recap),
    keyPoints: response.keyPoints.map(toRelative),
    lines: response.whereThingsStand.map(mapToRecapLine),
    attribution: prependHttps(response.attribution) ?? null,
    chapters: toRecapChapters(response.expanded).map((chapter) => ({
      ...chapter,
      body: toRelative(chapter.body),
    })),
    hasStory: Boolean(response.storySegment?.trim()),
  };
}
