// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  const TRAKT_CLIENT_ID: string;
  const TRAKT_MODE: 'development' | 'production';

  type Nil = null | undefined;

  type HttpsUrl = `https://${string}`;

  type ChildrenProps = {
    children: import('svelte').Snippet;
  };

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
