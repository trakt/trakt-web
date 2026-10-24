import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import type {
  RealityCheck,
  RealityCheckDetail,
} from '../models/RealityCheck.ts';
import type { RealityCheckResponse } from '../models/RealityCheckResponse.ts';

const STORY_SUBJECT = 'story';

function toRelative(text: string) {
  return toRelativeMarkdownLinks(text, SEO_ORIGIN);
}

function mapToDetail(
  response: RealityCheckResponse,
): RealityCheckDetail | null {
  if (response.breakdown === undefined) {
    return null;
  }

  return {
    breakdown: toRelative(response.breakdown),
    claims: (response.claims ?? []).map((claim) => ({
      ...claim,
      about:
        claim.about.trim().toLowerCase() === STORY_SUBJECT
          ? null
          : toRelative(claim.about),
      onScreen: toRelative(claim.onScreen),
      documented: toRelative(claim.documented),
    })),
    characters: (response.characters ?? []).map((character) => ({
      ...character,
      name: toRelative(character.name),
      note: toRelative(character.note),
    })),
    timeline: toRelative(response.timeline ?? ''),
    leftOut: (response.leftOut ?? []).map(toRelative),
  };
}

export function mapToRealityCheck(
  response?: RealityCheckResponse,
): RealityCheck | Nil {
  if (!response?.applicable) {
    return null;
  }

  return {
    verdict: response.verdict,
    story: response.story,
    protagonists: response.protagonists.map((protagonist) => ({
      ...protagonist,
      name: toRelative(protagonist.name),
    })),
    summary: toRelative(response.summary),
    detail: mapToDetail(response),
  };
}
