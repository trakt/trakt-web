import type { JellyfinSignIn } from '$lib/requests/media-sync/jellyfinAuthRequest.ts';
import type { JellyfinSignInDraft } from './models/JellyfinSignInDraft.ts';

const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

function toServerUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '' || SCHEME.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function toJellyfinSignIn(
  draft: JellyfinSignInDraft,
): JellyfinSignIn | null {
  const serverUrl = toServerUrl(draft.serverUrl);
  if (serverUrl === '') return null;

  if (draft.method === 'quick-connect') {
    return { method: 'quick-connect', serverUrl };
  }

  const username = draft.username.trim();
  if (username === '') return null;

  return { method: 'password', serverUrl, username, password: draft.password };
}
