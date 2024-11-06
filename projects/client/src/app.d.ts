// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  const TRAKT_CLIENT_ID: string;
  const TRAKT_CLIENT_SECRET: string;
  /** TODO: remove when auth flow is part of client */
  const TRAKT_BEARER_TOKEN: string;

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
