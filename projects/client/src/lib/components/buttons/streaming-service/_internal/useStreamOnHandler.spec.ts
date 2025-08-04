import { useStreamOnHandler } from '$lib/components/buttons/streaming-service/_internal/useStreamOnHandler.ts';
import type { StreamNow } from '$lib/requests/models/StreamingServiceOptions.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('useStreamOnHandler', () => {
  const service: StreamNow = {
    link: 'https://www.netflix.com/',
    source: 'netflix',
    is4k: false,
    type: 'streaming',
  };

  const mockWebOS = {
    service: {
      request: vi.fn(),
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return href when deepLinkHandler is not available', async () => {
    const handler = await renderStore(() => useStreamOnHandler(service));

    const href = 'href' in handler ? handler.href : '';
    expect(href).to.equal(service.link);
  });

  it('should return href when there is no deep link', async () => {
    vi.stubGlobal('webOS', mockWebOS);
    const handler = await renderStore(() => useStreamOnHandler(service));

    const href = 'href' in handler ? handler.href : '';
    expect(href).to.equal(service.link);
  });

  it('should return the deep link handler', async () => {
    vi.stubGlobal('webOS', mockWebOS);
    const handler = await renderStore(() =>
      useStreamOnHandler({
        ...service,
        webOSLink: {
          id: 'netflix',
          contentTarget: 'nflx://www.netflix.com/',
        },
      })
    );

    const onclick = 'onclick' in handler ? handler.onclick : null;
    expect(onclick).toBeDefined();
  });

  it('should call the deep link handler with the correct link', async () => {
    vi.stubGlobal('webOS', mockWebOS);
    const handler = await renderStore(() =>
      useStreamOnHandler({
        ...service,
        webOSLink: {
          id: 'netflix',
          contentTarget: 'nflx://www.netflix.com/',
        },
      })
    );

    const onclick = 'onclick' in handler ? handler.onclick : null;
    onclick?.();

    const [_, { parameters }] = assertDefined(
      mockWebOS.service.request.mock.calls[0],
    );
    expect(parameters).toEqual({
      id: 'netflix',
      params: {
        contentTarget: 'nflx://www.netflix.com/',
      },
    });
  });
});
