import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
} from '$lib/features/query/types.ts';
import { createStateWriter } from '$test/beds/svelte/createStateWriter.svelte.ts';
import { runInDerived } from '$test/beds/svelte/runInDerived.svelte.ts';
import { QueryClient } from '@tanstack/query-core';
import { BehaviorSubject, config, type Subscription } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryBridge, reactiveInfiniteQueryBridge } from './queryBridge.ts';

function buildOptions(): CreateQueryOptions<string, Error> {
  return {
    queryKey: ['queryBridge', 'shared'],
    queryFn: () => Promise.resolve('value'),
    staleTime: 0,
  };
}

function captureUnhandledErrors() {
  const errors: Array<unknown> = [];
  const previous = config.onUnhandledError;
  config.onUnhandledError = (error) => {
    errors.push(error);
  };

  return {
    errors,
    restore: () => {
      config.onUnhandledError = previous;
    },
  };
}

function flushUnhandledErrorReports() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('queryBridge', () => {
  const teardown: Array<() => void> = [];

  afterEach(() => {
    teardown.splice(0).forEach((fn) => fn());
  });

  it('should not trip state_unsafe_mutation when a sibling observer subscribes inside a $derived', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    teardown.push(() => client.clear());

    const captured = captureUnhandledErrors();
    teardown.push(captured.restore);

    const subscriptions: Array<Subscription> = [];
    teardown.push(() =>
      subscriptions.forEach((subscription) => subscription.unsubscribe())
    );

    const writer = createStateWriter();
    let status = 'pending';
    subscriptions.push(
      queryBridge<string, Error>(buildOptions, client)
        .subscribe((result) => {
          status = result.status;
          writer.write();
        }),
    );

    await vi.waitFor(() => expect(status).to.equal('success'));

    const writesBefore = writer.writes;

    teardown.push(runInDerived(() => {
      subscriptions.push(
        queryBridge<string, Error>(buildOptions, client).subscribe(() => {}),
      );
      return true;
    }));

    await flushUnhandledErrorReports();

    expect(captured.errors).to.deep.equal([]);
    expect(writer.writes).toBeGreaterThan(writesBefore);
  });
});

function buildInfiniteOptions(
  terms: string,
  fetched: string[],
): CreateInfiniteQueryOptions<string[], Error> {
  return {
    queryKey: ['reactiveInfiniteQueryBridge', terms],
    queryFn: () => {
      fetched.push(terms);
      return Promise.resolve([terms]);
    },
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    staleTime: 0,
  };
}

describe('reactiveInfiniteQueryBridge', () => {
  it('should keep one observer and move it to the new options', async () => {
    const client = new QueryClient();
    const fetched: string[] = [];
    const options$ = new BehaviorSubject(buildInfiniteOptions('a', fetched));

    const subscription = reactiveInfiniteQueryBridge(options$, client, {})
      .subscribe();

    await vi.waitFor(() => expect(fetched).toEqual(['a']));

    options$.next(buildInfiniteOptions('b', fetched));

    await vi.waitFor(() => expect(fetched).toEqual(['a', 'b']));

    const observerCount = (terms: string) =>
      client.getQueryCache()
        .find({ queryKey: ['reactiveInfiniteQueryBridge', terms] })
        ?.getObserversCount();

    expect(observerCount('a')).toBe(0);
    expect(observerCount('b')).toBe(1);

    subscription.unsubscribe();
    expect(observerCount('b')).toBe(0);
  });
});
