import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDeepLinkHandler } from './getDeepLinkHandler.ts';

describe('getDeepLinkHandler', () => {
  const mockStreamOnAndroid = {
    open: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return null when StreamOnAndroid is not available', () => {
    const handler = getDeepLinkHandler();
    expect(handler).toBeNull();
  });

  it('should return StreamOnAndroid when it is available', () => {
    vi.stubGlobal('StreamOnAndroid', mockStreamOnAndroid);
    const handler = getDeepLinkHandler();
    expect(handler).toBe(mockStreamOnAndroid);
  });

  it('should return null when StreamOnAndroid is falsy', () => {
    vi.stubGlobal('StreamOnAndroid', null);
    const handler = getDeepLinkHandler();
    expect(handler).toBeNull();
  });

  it('should call open method with correct parameters when available', () => {
    vi.stubGlobal('StreamOnAndroid', mockStreamOnAndroid);
    const handler = getDeepLinkHandler();

    handler?.open('testSource', 'deeplink://test');
    expect(mockStreamOnAndroid.open).toHaveBeenCalledWith(
      'testSource',
      'deeplink://test',
    );
  });
});
