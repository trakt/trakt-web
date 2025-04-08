import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import type { Sentiments } from '$lib/requests/models/Sentiments.ts';

type UserComment = {
  type: 'comment';
} & MediaComment;

type GeneratedComment = {
  type: 'sentiments';
} & Sentiments;

export type Comment = {
  id: number;
} & (UserComment | GeneratedComment);
