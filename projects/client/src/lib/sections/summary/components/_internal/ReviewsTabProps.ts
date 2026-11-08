import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type {
  EpisodeCommentProps,
  SeasonCommentProps,
} from '../comments/CommentsProps.ts';

export type ReviewsTabProps = {
  show: ShowEntry;
  target: SeasonCommentProps | EpisodeCommentProps;
  remountKey: number;
};
