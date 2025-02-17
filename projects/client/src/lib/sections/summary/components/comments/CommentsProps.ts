import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type EpisodeCommentProps = {
  type: 'episode';
  season: number;
  episode: number;
};

export type MediaCommentProps = {
  type: MediaType;
};

export type CommentsProps = {
  media: MediaEntry;
} & (MediaCommentProps | EpisodeCommentProps);
