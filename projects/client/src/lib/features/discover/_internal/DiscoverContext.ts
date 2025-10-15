import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Readable, Writable } from 'svelte/store';

export type DiscoverMode = MediaType;

export const DISCOVER_CONTEXT_KEY = Symbol('discover-context');

export type DiscoverContext = {
  mode: Writable<DiscoverMode>;
  routes: Readable<string[]>;
};
