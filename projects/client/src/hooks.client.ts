import '$lib/polyfills/toSorted.ts';
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
    "type 'module' in RegistrationOptions is not implemented yet",
    'Failed to fetch dynamically imported module',
    'error loading dynamically imported module',
    'Importing a module script failed',
    'Unable to preload CSS for',
    // Firebase Installations rejects when the device loses connectivity
    // — we use it solely for analytics, so the outage isn't actionable.
    'installations/app-offline',
    // Sentry's own replay integration touches cross-origin frames
    // injected by ad-blockers / privacy extensions.
    'Blocked a frame with origin',
    "Failed to read a named property 'Element' from 'Window'",
    // Third-party tracker / referrer-attribution script we don't own —
    // outages there leak through as unhandled rejections.
    'singleview.site',
    // Browser extension / userscript / native bridge noise — not our code.
    'WebViewJavascriptBridge',
    'userScripts is not defined',
    // Greasemonkey internal handle — the UUID is unique to GM and
    // identifies the same Sentry issue across browser error formats.
    'DA4BED8B-B90C-4112-BEB0-5293448AB67E',
    'Invalid call to runtime.sendMessage',
    'WKWebView API client did not respond',
    'Error invoking postEvent',
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

const DYNAMIC_IMPORT_RELOAD_KEY = 'dynamic-import-reload';

const DYNAMIC_IMPORT_ERROR_PATTERNS = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
  'Unable to preload CSS for',
];

function isDynamicImportError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return DYNAMIC_IMPORT_ERROR_PATTERNS.some((pattern) =>
    message.includes(pattern)
  );
}

function hasChunkPath(path?: string): boolean {
  if (!path) {
    return false;
  }

  return path.includes('/app/immutable/chunks/');
}

function getRejectionUrl(reason: unknown): string | undefined {
  if (typeof reason !== 'object' || reason === null) return undefined;
  if (!('url' in reason)) return undefined;
  return String((reason as { url?: unknown }).url ?? '');
}

function shouldReloadForRejection(event: PromiseRejectionEvent): boolean {
  if (isDynamicImportError(event.reason)) return true;
  return hasChunkPath(getRejectionUrl(event.reason));
}

function shouldReloadForError(event: ErrorEvent): boolean {
  if (isDynamicImportError(event.error ?? event.message)) return true;
  if (event.target instanceof HTMLScriptElement) {
    return hasChunkPath(event.target.src);
  }
  return hasChunkPath(event.filename);
}

function shouldReloadForClientEvent(
  event: ErrorEvent | PromiseRejectionEvent,
): boolean {
  if ('reason' in event) return shouldReloadForRejection(event);
  return shouldReloadForError(event);
}

function buildReloadUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('_cb', Date.now().toString());
  return url.toString();
}

function triggerReloadOnce(): void {
  if (sessionStorage.getItem(DYNAMIC_IMPORT_RELOAD_KEY)) return;

  sessionStorage.setItem(DYNAMIC_IMPORT_RELOAD_KEY, '1');
  window.location.replace(buildReloadUrl());
}

function reloadOnceForStaleDeploy(error: unknown): void {
  if (!isDynamicImportError(error)) return;
  triggerReloadOnce();
}

function reloadOnceFromClientEvent(
  event: ErrorEvent | PromiseRejectionEvent,
): void {
  if (!shouldReloadForClientEvent(event)) return;
  triggerReloadOnce();
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', reloadOnceFromClientEvent);
  window.addEventListener('unhandledrejection', reloadOnceFromClientEvent);
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry(
  ({ error }: { error: unknown }) => {
    reloadOnceForStaleDeploy(error);
  },
);
