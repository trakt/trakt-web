import type { BulkAddPick } from './BulkAddPick.ts';

type TraktId = { ids: { trakt: number } };

export function toBulkAddPayload(picks: ReadonlyArray<BulkAddPick>) {
  const toIds = (type: BulkAddPick['type']): TraktId[] =>
    picks
      .filter((pick) => pick.type === type)
      .map(({ id }) => ({ ids: { trakt: id } }));

  return {
    movies: toIds('movie'),
    shows: toIds('show'),
  };
}
