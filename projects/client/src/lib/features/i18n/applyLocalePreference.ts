import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { LocaleEndpoint } from './LocaleEndpoint.ts';

type ApplyLocalePreferenceProps = {
  value: string;
  setLocale: (value: string) => void;
};

/**
 * Applies a locale to the running app and persists it to the `trakt-locale`
 * cookie so it survives the next SSR render, then busts the worker cache.
 *
 * Shared by the locale picker (user-initiated change) and the settings
 * reconciler (saved-setting wins on a fresh/cookieless session). Does not
 * write the account setting - callers layer that on when appropriate.
 */
export async function applyLocalePreference({
  value,
  setLocale,
}: ApplyLocalePreferenceProps): Promise<void> {
  setLocale(value);

  await fetch(LocaleEndpoint.Set, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale: value }),
  });

  await workerRequest(WorkerMessage.CacheBust);
}
