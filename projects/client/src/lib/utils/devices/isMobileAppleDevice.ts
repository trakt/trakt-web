import { getMobileAppleDeviceType } from './getMobileAppleDeviceType.ts';

export function isMobileAppleDevice() {
  const deviceType = getMobileAppleDeviceType();

  return deviceType === 'iphone' || deviceType === 'ipad';
}
