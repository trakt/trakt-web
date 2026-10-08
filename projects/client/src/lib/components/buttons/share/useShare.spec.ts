import { BehaviorSubject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useShare } from './useShare.ts';

const { user, track } = vi.hoisted(() => ({
  user: { current: null as unknown },
  track: vi.fn(),
}));

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({ user: user.current }),
}));
vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

const shareData = {
  title: 'The Matrix',
  text: 'Watch The Matrix',
  url: 'https://app.trakt.tv/movies/the-matrix-1999',
};

describe('useShare', () => {
  const share = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.stubGlobal('navigator', { canShare: () => true, share });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('will stamp the signed-in user share code on the shared url', async () => {
    user.current = new BehaviorSubject({ shareCode: 'Xk3mPq2Bf9aQ' });

    await useShare({ id: 'summary', type: 'movie' }).share(shareData);

    expect(share).toHaveBeenCalledWith({
      ...shareData,
      url: 'https://app.trakt.tv/movies/the-matrix-1999?share=Xk3mPq2Bf9aQ',
    });
    expect(track).toHaveBeenCalledOnce();
  });

  it('will fall back to share=true without a share code', async () => {
    user.current = new BehaviorSubject({ shareCode: null });

    await useShare({ id: 'summary', type: 'movie' }).share(shareData);

    expect(share).toHaveBeenCalledWith({
      ...shareData,
      url: 'https://app.trakt.tv/movies/the-matrix-1999?share=true',
    });
  });

  it('will fall back to share=true while the user is still loading', async () => {
    user.current = new BehaviorSubject(undefined);

    await useShare({ id: 'summary', type: 'movie' }).share(shareData);

    expect(share).toHaveBeenCalledWith({
      ...shareData,
      url: 'https://app.trakt.tv/movies/the-matrix-1999?share=true',
    });
  });

  it('will warm the share image without sending it to the share sheet', async () => {
    user.current = new BehaviorSubject(undefined);
    const fetchMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('fetch', fetchMock);
    const image = 'https://app.trakt.tv/api/shareable-image?type=movie';

    await useShare({ id: 'summary', type: 'movie' }).share({
      ...shareData,
      image,
    });

    expect(fetchMock).toHaveBeenCalledWith(image, { priority: 'low' });
    expect(share).toHaveBeenCalledWith({
      ...shareData,
      url: 'https://app.trakt.tv/movies/the-matrix-1999?share=true',
    });
  });

  it('will not fetch anything without a share image', async () => {
    user.current = new BehaviorSubject(undefined);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await useShare({ id: 'summary', type: 'movie' }).share(shareData);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
