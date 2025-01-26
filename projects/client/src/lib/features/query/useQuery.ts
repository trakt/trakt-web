import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time';
import {
  createQuery,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { queryId } from './defineQuery';

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

    const id = props.queryKey.find((key) =>
      typeof key === 'string' && key.includes(queryId(''))
    ) as string | Nil;

    if (id == null) {
      return;
    }

    const isInvalidatedQueued = INVALIDATION_MAP.has(id);

    if (isInvalidatedQueued) {
      return;
    }

    INVALIDATION_MAP.set(id, Date.now());

    const timeoutId = setTimeout(() => {
      client.invalidateQueries({ queryKey: props.queryKey });
    }, time.seconds(1));

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return createQuery(props);
}
