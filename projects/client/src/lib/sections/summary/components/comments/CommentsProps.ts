import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type EpisodeCommentProps = {
  type: 'episode';
  season: number;
  episode: number;
  id: number;
};

export type SeasonCommentProps = {
  type: 'season';
  season: number;
  id: number;
};

export type MediaCommentProps = {
  type: MediaType;
};

export type CommentTypeProps =
  | MediaCommentProps
  | SeasonCommentProps
  | EpisodeCommentProps;

export type CommentsProps = {
  media: MediaEntry;
} & CommentTypeProps;
