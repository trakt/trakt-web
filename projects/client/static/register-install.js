// Only register service worker if not Safari

function isSafari() {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);
}

// Unregister existing service workers in Safari
if ('serviceWorker' in navigator && isSafari()) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

if ('serviceWorker' in navigator && !isSafari()) {
  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' });

    globalThis.addEventListener('beforeinstallprompt', (event) => {
      globalThis.install = event;
    });
  });
}
