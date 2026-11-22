export type PermissionedOrientationEvent = {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};
