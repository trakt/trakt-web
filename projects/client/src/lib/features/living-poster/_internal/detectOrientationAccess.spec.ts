import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectOrientationAccess } from './detectOrientationAccess.ts';

const stubDevice = ({
  isTouch,
  orientationEvent,
}: {
  isTouch: boolean;
  orientationEvent?: unknown;
}) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: isTouch })),
  );
  vi.stubGlobal('DeviceOrientationEvent', orientationEvent);
};

describe('util: detectOrientationAccess', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should not offer tilt on a device with a mouse', () => {
    stubDevice({ isTouch: false, orientationEvent: class {} });

    expect(detectOrientationAccess()).toBe('unsupported');
  });

  it('should not offer tilt when the orientation api is missing', () => {
    stubDevice({ isTouch: true });

    expect(detectOrientationAccess()).toBe('unsupported');
  });

  it('should need a permission where the browser gates the sensor', () => {
    stubDevice({
      isTouch: true,
      orientationEvent: { requestPermission: vi.fn() },
    });

    expect(detectOrientationAccess()).toBe('needs-permission');
  });

  it('should listen right away where the browser does not gate the sensor', () => {
    stubDevice({ isTouch: true, orientationEvent: class {} });

    expect(detectOrientationAccess()).toBe('available');
  });
});
