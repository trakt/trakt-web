import { api } from '$lib/requests/api.ts';

const SEARCH_LIMIT = 10;

export type ShowMatchQuery = {
  index: number;
  title: string;
  year?: number;
};

export type ShowMatchCandidate = {
  title: string;
  year?: number;
  tvdb?: number;
  imdb?: string;
};

export type ShowMatchResult = {
  index: number;
  candidates: ShowMatchCandidate[];
};

async function searchShow({
  index,
  title,
}: ShowMatchQuery): Promise<ShowMatchResult> {
  const response = await api().search.exact({
    query: { query: title, limit: SEARCH_LIMIT },
    params: { type: 'show' },
  });

  if (response.status !== 200) return { index, candidates: [] };

  const candidates = response.body.flatMap(({ show }) =>
    show
      ? [
          {
            title: show.title,
            year: show.year ?? undefined,
            tvdb: show.ids.tvdb ?? undefined,
            imdb: show.ids.imdb ?? undefined,
          },
        ]
      : [],
  );

  return { index, candidates };
}

export function matchShows(
  queries: ReadonlyArray<ShowMatchQuery>,
): Promise<ShowMatchResult[]> {
  return Promise.all(
    queries.map((query) =>
      searchShow(query).catch(() => ({
        index: query.index,
        candidates: [],
      })),
    ),
  );
}
