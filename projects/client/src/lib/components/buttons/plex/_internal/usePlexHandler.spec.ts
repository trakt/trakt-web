import { renderStore } from '$test/beds/store/renderStore.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePlexHandler } from './usePlexHandler.ts';

describe('usePlexHandler', () => {
  const plexLink = 'https://watch.plex.tv/show/silo';

  const mockStreamOnAndroid = {
    open: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return href when deepLinkHandler is not available', async () => {
    const handler = await renderStore(() => usePlexHandler(plexLink));

    const href = 'href' in handler ? handler.href : '';
    expect(href).to.equal(plexLink);
  });

  it('should return the deep link handler', async () => {
    vi.stubGlobal('StreamOnAndroid', mockStreamOnAndroid);
    const handler = await renderStore(() => usePlexHandler(plexLink));

    const onclick = 'onclick' in handler ? handler.onclick : null;
    expect(onclick).toBeDefined();
  });

  it('should call the deep link handler with the correct link', async () => {
    vi.stubGlobal('StreamOnAndroid', mockStreamOnAndroid);
    const handler = await renderStore(() => usePlexHandler(plexLink));

    const onclick = 'onclick' in handler ? handler.onclick : null;
    onclick?.();
    expect(mockStreamOnAndroid.open).toHaveBeenCalledWith(
      'Plex',
      plexLink,
    );
  });
});
