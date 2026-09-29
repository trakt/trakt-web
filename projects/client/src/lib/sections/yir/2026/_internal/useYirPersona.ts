import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  type YirPersonaParams,
  yirPersonaQuery,
} from '$lib/requests/queries/users/yirPersonaQuery.ts';
import { map, type Observable } from 'rxjs';

export function useYirPersona(params: Observable<YirPersonaParams>) {
  const query = useQuery(params.pipe(map(yirPersonaQuery)));

  return {
    persona: query.pipe(map(($query) => $query.data ?? null)),
  };
}
