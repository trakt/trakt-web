import { BehaviorSubject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useShareArrival } from './useShareArrival.ts';

const { isAuthorized, track, recordShareClickRequest } = vi.hoisted(() => ({
  isAuthorized: { current: null as unknown },
  track: vi.fn(),
  recordShareClickRequest: vi.fn(),
}));

vi.mock('$lib/features/auth/stores/useAuth.ts', () => ({
  useAuth: () => ({ isAuthorized: isAuthorized.current }),
}));
vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));
vi.mock('$lib/requests/queries/shares/recordShareClickRequest.ts', () => ({
  recordShareClickRequest,
}));

const route = '/movies/[slug]';
const sharedUrl = new URL(
  'https://app.trakt.tv/movies/the-matrix-1999?share=Xk3mPq2Bf9aQ',
);

describe('useShareArrival', () => {
  afterEach(() => vi.clearAllMocks());

  it('will record the click for a signed-in visitor and report the outcome', async () => {
    isAuthorized.current = new BehaviorSubject(true);
    recordShareClickRequest.mockResolvedValue('recorded');

    await useShareArrival().report({ url: sharedUrl, route });

    expect(recordShareClickRequest).toHaveBeenCalledWith({
      body: { code: 'Xk3mPq2Bf9aQ', url: sharedUrl.toString() },
    });
    expect(track).toHaveBeenCalledWith({ type: 'movie', outcome: 'recorded' });
  });

  it('will only report an anonymous arrival when signed out', async () => {
    isAuthorized.current = new BehaviorSubject(false);

    await useShareArrival().report({ url: sharedUrl, route });

    expect(recordShareClickRequest).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith({ type: 'movie', outcome: 'anonymous' });
  });

  it('will report a legacy share=true link as uncredited', async () => {
    isAuthorized.current = new BehaviorSubject(true);

    await useShareArrival().report({
      url: new URL('https://app.trakt.tv/movies/the-matrix-1999?share=true'),
      route,
    });

    expect(recordShareClickRequest).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith({
      type: 'movie',
      outcome: 'uncredited',
    });
  });

  it('will report a failed request without throwing', async () => {
    isAuthorized.current = new BehaviorSubject(true);
    recordShareClickRequest.mockRejectedValue(new Error('offline'));

    await useShareArrival().report({ url: sharedUrl, route });

    expect(track).toHaveBeenCalledWith({ type: 'movie', outcome: 'failed' });
  });

  it('will do nothing on a page without a share param', async () => {
    isAuthorized.current = new BehaviorSubject(true);

    await useShareArrival().report({
      url: new URL('https://app.trakt.tv/movies/the-matrix-1999'),
      route,
    });

    expect(recordShareClickRequest).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });
});
