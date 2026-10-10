import { useQuery } from '$lib/features/query/useQuery.ts';
import { resolveSlurm } from '$lib/features/webview/resolveSlurm.ts';
import {
  type YirPersonaParams,
  yirPersonaQuery,
} from '$lib/requests/queries/users/yirPersonaQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export function useYirPersona(params: Observable<YirPersonaParams>) {
  const query = useQuery(
    params.pipe(
      map(($params) => yirPersonaQuery({ ...$params, slurm: resolveSlurm() })),
    ),
  );

  return {
    persona: query.pipe(map(($query) => $query.data ?? null)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
