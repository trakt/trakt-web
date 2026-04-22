if ('serviceWorker' in navigator) {
  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' });

    globalThis.addEventListener('beforeinstallprompt', (event) => {
      globalThis.install = event;
    });
  });
}
