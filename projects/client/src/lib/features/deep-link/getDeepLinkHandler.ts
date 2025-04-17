type DeepLinkHandler = {
  open: (sourceName: string, deepLink: string) => void;
};

export function getDeepLinkHandler(): DeepLinkHandler | null {
  const hasStreamOnAndroid = typeof StreamOnAndroid !== 'undefined' &&
    StreamOnAndroid;

  return hasStreamOnAndroid ? StreamOnAndroid : null;
}
