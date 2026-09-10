import type { CreateMutationOptions } from '$lib/features/query/types.ts';
import { MutationCache, QueryClient } from '@tanstack/query-core';
import type { Subscription } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mutationBridge } from './mutationBridge.ts';

type Variables = { value: string };

function buildOptions(
  mutationFn: (variables: Variables) => Promise<string>,
): CreateMutationOptions<string, Error, Variables> {
  return { mutationKey: ['mutationBridge'], mutationFn };
}

describe('mutationBridge', () => {
  const teardown: Array<() => void> = [];

  afterEach(() => {
    teardown.splice(0).forEach((fn) => fn());
  });

  function createClient(mutationCache?: MutationCache) {
    const client = new QueryClient({ mutationCache });
    teardown.push(() => client.clear());
    return client;
  }

  function collect<T>(
    subscription: (push: (value: T) => void) => Subscription,
  ) {
    const values: Array<T> = [];
    const sub = subscription((value) => values.push(value));
    teardown.push(() => sub.unsubscribe());
    return values;
  }

  it('should emit the idle result synchronously, then pending and success', async () => {
    const bridge = mutationBridge(
      buildOptions(({ value }) => Promise.resolve(value)),
      createClient(),
    );

    const statuses = collect<string>((push) =>
      bridge.result$.subscribe(({ status }) => push(status))
    );

    expect(statuses).to.deep.equal(['idle']);

    await bridge.mutate({ value: 'done' });

    await vi.waitFor(() => expect(statuses.at(-1)).to.equal('success'));
    expect(statuses).to.deep.equal(['idle', 'pending', 'success']);
  });

  it('should run the mutation and its cache callbacks without any subscriber', async () => {
    const onSuccess = vi.fn();
    const client = createClient(new MutationCache({ onSuccess }));

    const bridge = mutationBridge(
      buildOptions(({ value }) => Promise.resolve(value)),
      client,
    );

    await expect(bridge.mutate({ value: 'done' })).resolves.to.equal('done');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should reject the caller when the mutation fails', async () => {
    const bridge = mutationBridge(
      buildOptions(() => Promise.reject(new Error('nope'))),
      createClient(),
    );

    const statuses = collect<string>((push) =>
      bridge.result$.subscribe(({ status }) => push(status))
    );

    await expect(bridge.mutate({ value: 'boom' })).rejects.toThrow('nope');
    expect(statuses.at(-1)).to.equal('error');
  });

  it('should keep the result pending until cache invalidation settles', async () => {
    let releaseInvalidation = () => {};
    const invalidation = new Promise<void>((resolve) => {
      releaseInvalidation = resolve;
    });

    const client = createClient(
      new MutationCache({ onSuccess: () => invalidation }),
    );

    const bridge = mutationBridge(
      buildOptions(({ value }) => Promise.resolve(value)),
      client,
    );

    const pending = collect<boolean>((push) =>
      bridge.result$.subscribe(({ isPending }) => push(isPending))
    );

    const mutated = bridge.mutate({ value: 'done' });

    await vi.waitFor(() => expect(pending.at(-1)).to.equal(true));

    releaseInvalidation();
    await mutated;

    await vi.waitFor(() => expect(pending.at(-1)).to.equal(false));
  });

  it('should stop emitting to a subscriber that unsubscribed', async () => {
    const bridge = mutationBridge(
      buildOptions(({ value }) => Promise.resolve(value)),
      createClient(),
    );

    const statuses: Array<string> = [];
    bridge.result$
      .subscribe(({ status }) => statuses.push(status))
      .unsubscribe();

    await bridge.mutate({ value: 'done' });

    expect(statuses).to.deep.equal(['idle']);
  });
});
