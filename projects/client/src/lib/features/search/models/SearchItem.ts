import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';

export type SearchItem = PersonSummary | MediaEntry | MediaListSummary;
