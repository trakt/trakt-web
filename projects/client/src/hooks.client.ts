import '$lib/polyfills/at.ts';
import '$lib/polyfills/mapGroupBy.ts';
import '$lib/polyfills/randomUUID.ts';
import '$lib/polyfills/toReversed.ts';
import '$lib/polyfills/toSorted.ts';
import { captureWebviewSession } from '$lib/features/webview/captureWebviewSession.ts';
import { SentryEndpoint } from '$lib/features/sentry/SentryEndpoint.ts';
import { SENTRY_DSN } from '$lib/utils/constants.ts';
import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';
import { delay } from '$lib/utils/timing/delay.ts';
import { time } from '$lib/utils/timing/time.ts';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';
import type { ErrorEvent as SentryErrorEvent } from '@sentry/sveltekit';

// Must run before Sentry.init and before SvelteKit reads `location`: strips the
// WebView params (slurm VIP token, standalone flag) from the URL and latches
// them to sessionStorage, so page.url, Sentry tracing and analytics never see
// the token.
captureWebviewSession();

const SAMPLED_ERROR_PATTERNS = [
  /^Failed to fetch( \((app|media)\.trakt\.tv\))?$/,
  /^Load failed( \((app|media)\.trakt\.tv\))?$/,
  /^NetworkError when attempting to fetch resource\.( \((app|media)\.trakt\.tv\))?$/,
  /^network error$/,
  /^Internal error$/,
  /^Non-Error promise rejection captured with value: undefined$/,
];

const SAMPLED_ERROR_RATE = 0.01;

function isServiceWorkerRejection(event: SentryErrorEvent): boolean {
  return event.exception?.values?.some(({ type, value, stacktrace }) => {
    const isRejected = type === 'Rejected' || value === 'Rejected';
    const isServiceWorker = stacktrace?.frames?.some(
      (frame) =>
        frame.filename?.includes('service-worker') ||
        frame.function?.includes('navigator.serviceWorker.register') ||
        frame.function?.includes('ServiceWorkerContainer.register'),
    );

    return isRejected && isServiceWorker;
  }) ?? false;
}

function isSampledError(event: SentryErrorEvent): boolean {
  return event.exception?.values?.some(({ value }) =>
    SAMPLED_ERROR_PATTERNS.some((pattern) => pattern.test(value ?? ''))
  ) ?? false;
}

Sentry.init({
  dsn: SENTRY_DSN,

  tunnel: SentryEndpoint.Tunnel,

  // Matches the server rate. Client navigations are the higher-volume side, so
  // sampling them harder than the server made the asymmetry backwards.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // No session replay: it persists a replay id in sessionStorage, which is the
  // non-essential device storage a cookie banner would have to ask about.
  integrations: [],
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
    /^Module load timeout: m_\d+$/,
    // Cross-origin frames we cannot reach into: embedded players, plus frames
    // injected by ad-blockers / privacy extensions.
    'Blocked a frame with origin',
    "Failed to read a named property 'Element' from 'Window'",
    // Third-party tracker / referrer-attribution script we don't own —
    // outages there leak through as unhandled rejections.
    'singleview.site',
    // Browser extension / userscript / native bridge noise — not our code.
    'WebViewJavascriptBridge',
    'userScripts is not defined',
    "Identifier 'nativeIframe' has already been declared",
    // Greasemonkey internal handle — the UUID is unique to GM and
    // identifies the same Sentry issue across browser error formats.
    'DA4BED8B-B90C-4112-BEB0-5293448AB67E',
    'Invalid call to runtime.sendMessage',
    'btn-watch-now',
    'WKWebView API client did not respond',
    'Error invoking postEvent',
  ],
  beforeSend(event) {
    if (isServiceWorkerRejection(event)) {
      return null;
    }

    if (
      isSampledError(event) &&
      Math.random() >= SAMPLED_ERROR_RATE
    ) {
      return null;
    }

    return event;
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

  // SvelteKit emits immutable chunk URLs under `/_app/immutable/`.
  // Match both the absolute prefix and the relative form so the recovery
  // also catches errors triggered from cross-origin or relative resolutions.
  return path.includes('/_app/immutable/') ||
    path.includes('_app/immutable/');
}

function getRejectionUrl(reason: unknown): string | undefined {
  if (typeof reason !== 'object' || reason === null) return undefined;
  if (!('url' in reason)) return undefined;
  return String((reason as { url?: unknown }).url ?? '');
}

type RecoveryAction = 'purge-and-reload' | 'reload';

function getRecoveryForRejection(
  event: PromiseRejectionEvent,
): RecoveryAction | undefined {
  if (isDynamicImportError(event.reason)) return 'purge-and-reload';
  if (hasChunkPath(getRejectionUrl(event.reason))) return 'purge-and-reload';
  return undefined;
}

function getRecoveryForError(event: ErrorEvent): RecoveryAction | undefined {
  if (isDynamicImportError(event.error ?? event.message)) {
    return 'purge-and-reload';
  }

  if (event.target instanceof HTMLScriptElement) {
    return hasChunkPath(event.target.src) ? 'purge-and-reload' : undefined;
  }

  return hasChunkPath(event.filename) ? 'reload' : undefined;
}

function getRecoveryForClientEvent(
  event: ErrorEvent | PromiseRejectionEvent,
): RecoveryAction | undefined {
  if ('reason' in event) return getRecoveryForRejection(event);
  return getRecoveryForError(event);
}

function buildReloadUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('_cb', Date.now().toString());
  return url.toString();
}

async function purgeCaches(): Promise<void> {
  if (!('caches' in window)) return;

  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

async function unregisterServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );
}

const RECOVERY_CLEANUP_TIMEOUT_MS = time.seconds(3);

function triggerReloadOnce(action: RecoveryAction): void {
  if (!navigator.onLine) return;
  if (safeSessionStorage.getItem(DYNAMIC_IMPORT_RELOAD_KEY)) return;

  safeSessionStorage.setItem(DYNAMIC_IMPORT_RELOAD_KEY, '1');

  // `_cb` asks the worker to drop the navigation cache. The purge path
  // unregisters it first, so that reload is uncontrolled: nothing would honour
  // the param, and nothing would strip it back out of the URL.
  if (action === 'reload') {
    window.location.replace(buildReloadUrl());
    return;
  }

  Promise.race([
    Promise.allSettled([purgeCaches(), unregisterServiceWorkers()]),
    delay(RECOVERY_CLEANUP_TIMEOUT_MS),
  ]).then(() => window.location.reload());
}

function reloadOnceForStaleDeploy(error: unknown): void {
  if (!isDynamicImportError(error)) return;
  triggerReloadOnce('purge-and-reload');
}

function reloadOnceFromClientEvent(
  event: ErrorEvent | PromiseRejectionEvent,
): void {
  const action = getRecoveryForClientEvent(event);
  if (action === undefined) return;
  triggerReloadOnce(action);
}

if (typeof window !== 'undefined') {
  // Resource load errors do not bubble.
  window.addEventListener('error', reloadOnceFromClientEvent, {
    capture: true,
  });
  window.addEventListener('unhandledrejection', reloadOnceFromClientEvent);
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry(
  ({ error }: { error: unknown }) => {
    reloadOnceForStaleDeploy(error);
  },
);
