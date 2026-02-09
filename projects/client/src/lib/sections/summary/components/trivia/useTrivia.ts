import { combineLatest, map } from 'rxjs';
import { useQuery } from '../../../../features/query/useQuery.ts';
import type { MediaType } from '../../../../requests/models/MediaType.ts';
import { movieTriviaQuery } from '../../../../requests/queries/movies/movieTriviaQuery.ts';
import { showTriviaQuery } from '../../../../requests/queries/shows/showTriviaQuery.ts';

type UseTriviaProps = {
  slug: string;
  type: MediaType;
  variant: 'spoilers' | 'no-spoilers';
};

function toQuery(props: UseTriviaProps) {
  const params = { slug: props.slug };

  switch (props.type) {
    case 'movie':
      return movieTriviaQuery(params);
    case 'show':
      return showTriviaQuery(params);
  }
}
export function useTrivia(props: UseTriviaProps) {
  const query = useQuery(toQuery(props));

  const hasSpoilers = query.pipe(
    map(($query) => {
      if (!$query.data) {
        return false;
      }

      return $query.data.items.some((trivia) => trivia.isSpoiler);
    }),
  );

  return {
    list: combineLatest([query, hasSpoilers]).pipe(
      map(([$query, $hasSpoilers]) => {
        if (!$query.data) {
          return [];
        }

        return $query.data.items.filter((trivia) => {
          if (!$hasSpoilers) {
            return true;
          }

          return props.variant === 'spoilers'
            ? trivia.isSpoiler
            : !trivia.isSpoiler;
        });
      }),
    ),
    summary: query.pipe(
      map(($query) => $query.data ? [$query.data.summary] : []),
    ),
    hasSpoilers,
  };
}
