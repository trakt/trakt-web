import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMobileAppleDeviceType } from './getMobileAppleDeviceType';

describe('getMobileAppleDeviceType', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return none when not an apple mobile device', () => {
    expect(getMobileAppleDeviceType()).toBe('none');
  });

  it('should return iphone when platform is iphone', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    platformSpy.mockReturnValue('iPhone');
    expect(getMobileAppleDeviceType()).toBe('iphone');
  });

  it('should return ipad when platform is ipad', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    platformSpy.mockReturnValue('iPad');
    expect(getMobileAppleDeviceType()).toBe('ipad');
  });

  it('should return ipad when platform is MacIntel and has multiple touch points', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    const touchSpy = vi.spyOn(globalThis.navigator, 'maxTouchPoints', 'get');

    touchSpy.mockReturnValue(2);
    platformSpy.mockReturnValue('MacIntel');
    expect(getMobileAppleDeviceType()).toBe('ipad');
  });

  it('should return none when platform is MacIntel and no touch points', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');

    platformSpy.mockReturnValue('MacIntel');
    expect(getMobileAppleDeviceType()).toBe('none');
  });
});
