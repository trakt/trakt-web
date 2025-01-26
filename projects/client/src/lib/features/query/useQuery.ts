import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time';
import {
  createQuery,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { QUERY_ID } from './defineQuery';

const INVALIDATION_MAP = new Map<string, number>();

export function useQuery<
  TOutput,
  TError extends Error,
>(
  props: CreateQueryOptions<TOutput, TError>,
) {
  const client = browser ? useQueryClient() : undefined;

  onMount(() => {
    if (client == null) {
      return;
    }

    const queryId = props.queryKey.find((key) =>
      typeof key === 'string' && key.includes(`${QUERY_ID}:`)
    ) as string | Nil;

    if (queryId == null) {
      return;
    }

    const isInvalidatedQueued = INVALIDATION_MAP.has(queryId);

    if (isInvalidatedQueued) {
      return;
    }

    INVALIDATION_MAP.set(queryId, Date.now());

    const timeoutId = setTimeout(() => {
      client.invalidateQueries({ queryKey: props.queryKey });
    }, time.seconds(1));

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return createQuery(props);
}
