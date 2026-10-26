type PageLifecycleContext = {
  isUnloading: boolean;
  visibility: DocumentVisibilityState;
  readyState: DocumentReadyState;
  isOnline: boolean;
  secondsSinceLoad: number;
};

export function trackPageLifecycle(target: Window): () => PageLifecycleContext {
  const state = { isUnloading: false };

  target.addEventListener('pagehide', () => {
    state.isUnloading = true;
  });
  target.addEventListener('pageshow', () => {
    state.isUnloading = false;
  });

  return () => ({
    isUnloading: state.isUnloading,
    visibility: target.document.visibilityState,
    readyState: target.document.readyState,
    isOnline: target.navigator.onLine,
    secondsSinceLoad: Math.round(target.performance.now() / 1000),
  });
}
