import { useQuery } from '$lib/features/query/useQuery.ts';
import { awardCatalogQuery } from '$lib/requests/queries/awards/awardCatalogQuery.ts';
import { map } from 'rxjs';
import { toSmartListAwardLabels } from './toSmartListAwardLabels.ts';

export function useSmartListAwardLabels() {
  return useQuery(awardCatalogQuery()).pipe(
    map((query) => toSmartListAwardLabels(query.data ?? [])),
  );
}
