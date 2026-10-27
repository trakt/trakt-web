import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';
import { toRecapResult } from './toRecapResult.ts';

type RecapQueryProps<TTarget, TOutput, TError extends Error> = {
  target$: Observable<TTarget>;
  toQuery: (props: {
    target: TTarget;
    isVip: boolean;
  }) => CreateQueryOptions<TOutput, TError>;
};

export function useRecapQuery<TTarget, TOutput, TError extends Error = Error>({
  target$,
  toQuery,
}: RecapQueryProps<TTarget, TOutput, TError>) {
  const { user } = useUser();

  const isVip = user.pipe(
    map((currentUser) => currentUser?.isVip ?? false),
    distinctUntilChanged(),
  );

  const query = useQuery(
    combineLatest([target$, isVip]).pipe(
      map(([target, isVipValue]) => toQuery({ target, isVip: isVipValue })),
    ),
  );

  return {
    isVip,
    result: query.pipe(map(toRecapResult), distinctUntilChanged()),
  };
}
