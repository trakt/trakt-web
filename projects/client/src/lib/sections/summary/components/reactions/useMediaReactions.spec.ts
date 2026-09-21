import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useMediaReactions } from './useMediaReactions.ts';

vi.mock('$lib/stores/useInvalidator.ts');

const target: ReactionTarget = { type: 'movie', id: 1, slug: 'heretic-2024' };

describe('store: useMediaReactions', () => {
  const invalidate = vi.fn(function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();
    (useInvalidator as Mock).mockReturnValue({ invalidate });
  });

  it('should rank the top three by count, ties in declared order', async () => {
    const { top } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    const value = await waitForEmission(top, 2);

    expect(value.map((reaction) => reaction.type)).toEqual([
      'heart_eyes',
      'skull',
      'fire',
    ]);
  });

  it('should list every known reaction, zeros last', async () => {
    const { reactions } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    const value = await waitForEmission(reactions, 2);

    expect(value).toHaveLength(36);
    expect(value.at(0)?.type).toBe('heart_eyes');
    expect(value.at(0)?.code).toBe('1f60d');
    expect(value.at(-1)?.count).toBe(0);
  });

  it('should expose my reactions with their row ids', async () => {
    const { mine } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    expect(await waitForEmission(mine, 2)).toEqual([
      { id: 42, type: 'skull' },
    ]);
  });

  it('should PUT the type name when reacting and remember it', async () => {
    const { react, recent } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    const requests = await captureRequests(() =>
      react({ target, type: 'fire' })
    );

    expect(requests).toContain('PUT /v3/movies/heretic-2024/reactions/fire');
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect((await firstValueFrom(recent)).at(0)?.type).toBe('fire');
  });

  it('should DELETE by row id when removing', async () => {
    const { remove } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    const requests = await captureRequests(() => remove({ target, id: 42 }));

    expect(requests).toContain('DELETE /v3/movies/heretic-2024/reactions/42');
  });

  it('should re-enable the picker and skip recents when the server refuses', async () => {
    server.use(
      http.put(
        'http://localhost/v3/:type/:reference/reactions/:types',
        () => HttpResponse.json({ error: 'at most 3' }, { status: 409 }),
      ),
    );

    const { react, recent, isReacting } = await renderStore(() =>
      useMediaReactions(valueObservable(target))
    );

    await react({ target, type: 'popcorn' });

    expect(await firstValueFrom(isReacting)).toBe(false);
    expect(invalidate).not.toHaveBeenCalled();
    expect((await firstValueFrom(recent)).map((r) => r.type)).not.toContain(
      'popcorn',
    );
  });
});
