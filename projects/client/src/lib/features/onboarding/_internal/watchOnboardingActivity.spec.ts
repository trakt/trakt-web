import { QueryClient } from '@tanstack/query-core';
import { buildOnboardingSet } from '$test/beds/onboarding/buildOnboardingSet.ts';
import { describe, expect, it, vi } from 'vitest';
import { watchOnboardingActivity } from './watchOnboardingActivity.ts';

const set = buildOnboardingSet({
  id: 'set',
  steps: [
    { id: 'account' },
    {
      id: 'watchlist',
      completesWith: { signal: 'watchlist', mutations: ['watchlist:add'] },
    },
    {
      id: 'watched',
      completesWith: {
        signal: 'plays',
        mutations: ['history:add', 'media:check-in'],
      },
    },
  ],
});

async function runMutation({
  client,
  key,
  data,
}: {
  client: QueryClient;
  key: string;
  data: unknown;
}) {
  await client
    .getMutationCache()
    .build(client, { mutationKey: [key], mutationFn: async () => data })
    .execute(undefined);
}

function setup() {
  const client = new QueryClient();
  const onAction = vi.fn();
  watchOnboardingActivity({ client, sets: [set], onAction });
  return { client, onAction };
}

describe('util: watchOnboardingActivity', () => {
  it('should report the step whose mutations include the key', async () => {
    const { client, onAction } = setup();

    await runMutation({ client, key: 'media:check-in', data: {} });

    expect(onAction).toHaveBeenCalledExactlyOnceWith({
      setId: 'set',
      stepId: 'watched',
    });
  });

  it('should leave steps with a threshold to the account count', async () => {
    const client = new QueryClient();
    const onAction = vi.fn();
    watchOnboardingActivity({
      client,
      sets: [
        buildOnboardingSet({
          steps: [
            {
              id: 'binge',
              completesWith: {
                signal: 'plays',
                mutations: ['history:add'],
                atLeast: 3,
              },
            },
          ],
        }),
      ],
      onAction,
    });

    await runMutation({ client, key: 'history:add', data: {} });

    expect(onAction).not.toHaveBeenCalled();
  });

  it('should ignore mutations no step listens to', async () => {
    const { client, onAction } = setup();

    await runMutation({ client, key: 'other', data: {} });

    expect(onAction).not.toHaveBeenCalled();
  });

  it('should ignore queued data', async () => {
    const { client, onAction } = setup();

    await runMutation({ client, key: 'watchlist:add', data: 'queued' });

    expect(onAction).not.toHaveBeenCalled();
  });

  it('should ignore mutations that did not succeed', async () => {
    const { client, onAction } = setup();

    await client
      .getMutationCache()
      .build(client, {
        mutationKey: ['watchlist:add'],
        mutationFn: async () => {
          throw new Error('nope');
        },
      })
      .execute(undefined)
      .catch(() => undefined);

    expect(onAction).not.toHaveBeenCalled();
  });
});
