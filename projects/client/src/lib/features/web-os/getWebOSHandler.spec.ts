import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWebOSHandler } from './getWebOSHandler.ts';

describe('getWebOSHandler', () => {
  const mockWebOS = {
    service: {
      request: vi.fn(),
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return null when webOS is not available', () => {
    const handler = getWebOSHandler();
    expect(handler).toBeNull();
  });

  it('should return webOS when it is available', () => {
    vi.stubGlobal('webOS', mockWebOS);
    const handler = getWebOSHandler();

    expect(handler).toBeDefined();
    expect(typeof handler?.launch).toBe('function');
    expect(typeof handler?.plex).toBe('function');
    expect(typeof handler?.youtube).toBe('function');
  });

  it('should return null when webOS is falsy', () => {
    vi.stubGlobal('webOS', null);
    const handler = getWebOSHandler();
    expect(handler).toBeNull();
  });

  it('should call open method with correct parameters when available', () => {
    vi.stubGlobal('webOS', mockWebOS);
    const handler = getWebOSHandler();

    handler?.launch('testSource', {
      id: 'app_id',
      contentTarget: 'https://content/target',
    });

    const [_, { parameters }] = assertDefined(
      mockWebOS.service.request.mock.calls[0],
    );
    expect(parameters).toEqual({
      id: 'app_id',
      params: {
        contentTarget: 'https://content/target',
      },
    });
  });
});
