import type { RecommendationSource } from '../models/RecommendationSource.ts';
import type { Source, Subgenre } from '../models/RecommendationsResponse.ts';
import { mapToMovieEntry } from './mapToMovieEntry.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';

function dedupeSubgenres(subgenres: Subgenre[]): Subgenre[] {
  const seen = new Set<string>();
  return subgenres.filter(({ slug }) => {
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

export function mapToRecommendationSource(
  source: Source,
): RecommendationSource {
  const base = 'movie' in source
    ? { mediaType: 'movie' as const, media: mapToMovieEntry(source.movie) }
    : { mediaType: 'show' as const, media: mapToShowEntry(source.show) };

  if (source.type === 'subgenre') {
    return {
      id: source.id,
      type: 'subgenre',
      stars: source.stars,
      ...base,
      subgenres: dedupeSubgenres(source.subgenres),
    };
  }

  return {
    id: source.id,
    type: source.type,
    stars: source.stars,
    ...base,
  };
}
