import type { MediaReactionsBadgeProps } from '$lib/features/media-reactions/MediaReactionsBadgeProps.ts';
import type { Snippet } from 'svelte';

export type SummarySocialRowProps = MediaReactionsBadgeProps & {
  title: string;
  extra?: Snippet;
};
