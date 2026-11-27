import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MovieLore } from '../models/MovieLore.ts';
import type { MovieLoreResponse } from '../models/MovieLoreResponse.ts';
import { mapToLoreMovie } from './mapToLoreMovie.ts';

function toRelative(text: string) {
  return toRelativeMarkdownLinks(text, SEO_ORIGIN);
}

export function mapToMovieLore(response?: MovieLoreResponse): MovieLore | null {
  if (!response) {
    return null;
  }

  return {
    kind: response.kind,
    setup: response.setup.map(toRelative),
    watchFirst: response.watchFirst
      ? {
          verdict: response.watchFirst.verdict,
          note: toRelative(response.watchFirst.note),
          movies: response.watchFirst.movies.map(mapToLoreMovie),
        }
      : null,
    earlier: response.earlier.map(mapToLoreMovie),
    attribution: prependHttps(response.attribution) ?? null,
    locked: response.locked ?? null,
    lore: (response.lore ?? []).map(toRelative),
    previously: (response.previously ?? []).map(({ movie, summary }) => ({
      movie: mapToLoreMovie(movie),
      summary: toRelative(summary),
    })),
  };
}
