import { server } from '$mocks/server.ts';
import { serveUnusedAccount } from '$test/beds/next-steps/serveUnusedAccount.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { NextStepId } from '../NextStepId.ts';
import type { NextStepsState } from '../NextStepsState.ts';
import { useNextSteps } from './useNextSteps.ts';

describe('store: useNextSteps', () => {
  beforeEach(() => {
    setAuthorization(true);
    serveUnusedAccount();
  });

  it('should show steps to a free member who never used Trakt', async () => {
    const result = await runQuery({
      factory: () => useNextSteps().state,
      waitFor: (value) => value?.status !== 'loading',
    });

    expect(result?.status).toBe('visible');
    expect(result?.status === 'visible' && result.page.steps.at(0)).toEqual({
      id: NextStepId.WatchHistory,
      isDone: false,
    });
  });

  it('should settle when account queries fail', async () => {
    server.use(
      http.get(
        'http://localhost/users/me/ratings/*',
        () => new HttpResponse(null, { status: 500 }),
      ),
      http.get(
        'http://localhost/users/me/following',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const result = await runQuery({
      factory: () => useNextSteps().state,
      waitFor: (value) => value?.status !== 'loading',
    });

    expect(result?.status).toBe('visible');
  }, 20_000);

  it('should replace a skipped step and restore it on undo', async () => {
    const stepIds = (state: NextStepsState | undefined) =>
      state?.status === 'visible'
        ? state.page.steps.map((step) => step.id)
        : [];

    const skipped = await runQuery({
      factory: () => {
        const { state, skip } = useNextSteps();
        skip(NextStepId.WatchHistory);
        return state;
      },
      waitFor: (value) =>
        value?.status === 'visible' &&
        !stepIds(value).includes(NextStepId.WatchHistory),
    });
    expect(stepIds(skipped)).toHaveLength(3);

    const restored = await runQuery({
      factory: () => {
        const { state, unskip } = useNextSteps();
        unskip(NextStepId.WatchHistory);
        return state;
      },
      waitFor: (value) => stepIds(value).includes(NextStepId.WatchHistory),
    });
    expect(stepIds(restored).at(0)).toBe(NextStepId.WatchHistory);
  });

  // Runs last: preferences are shared module state, and a dismissal sticks.
  it('should hide once dismissed', async () => {
    const result = await runQuery({
      factory: () => {
        const { state, dismiss } = useNextSteps();
        dismiss();
        return state;
      },
      waitFor: (value) => value?.status === 'hidden',
    });

    expect(result).toEqual({ status: 'hidden' });
  });
});
