import { SENTRY_DSN } from '$lib/utils/constants.ts';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';

Sentry.init({
  dsn: SENTRY_DSN,

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [replayIntegration({
    maskAllInputs: false,
    maskAllText: false,
    blockAllMedia: false,
  })],
  // Strings for partial matches. Regex patterns for exact matches.
  ignoreErrors: [
    'CancelledError',
    'AbortError',
    'Failed to register a ServiceWorker',
    'service-worker.js load failed',
  ],
  beforeSend(event) {
    const isWellKnownRejection = event.exception?.values?.some(
      ({ type, value, stacktrace }) => {
        const isRejected = type === 'Rejected' || value === 'Rejected';
        const isServiceWorker = stacktrace?.frames?.some(
          (frame) =>
            frame.filename?.includes('service-worker') ||
            frame.function?.includes('navigator.serviceWorker.register') ||
            frame.function?.includes('ServiceWorkerContainer.register'),
        );

        return isRejected && isServiceWorker;
      },
    );

    return isWellKnownRejection ? null : event;
  },
});

// FIXME remove once we have custom paraglide handling for this
// Remove PARAGLIDE_LOCALE cookie if it appears multiple times
if (typeof document !== 'undefined') {
  const cookies = document.cookie.split(';');
  const localesCookies = cookies.filter((cookie) => {
    const [name] = cookie.trim().split('=');
    return name === 'PARAGLIDE_LOCALE';
  });

  if (localesCookies.length > 1) {
    // Delete all instances of PARAGLIDE_LOCALE
    document.cookie =
      'PARAGLIDE_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie =
      'PARAGLIDE_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.app.trakt.tv';
    document.cookie =
      'PARAGLIDE_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=app.trakt.tv';
  }
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
