import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { Snippet } from 'svelte';
import type { ShareType } from './models/ShareType.ts';

export type ShareCardFrameProps = {
  variant: ShareType;
  colors?: MediaEntry['colors'];
  backdropWidthRatio?: number;
  children: Snippet;
};
