import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import type { ToggleOption } from '../ToggleOption.ts';

export type TogglerId =
  | 'social'
  | 'discover'
  | 'comment'
  | 'trivia'
  | 'progress';

type DiscoverToggleType = DiscoverMode;
type SocialToggleType = 'following' | 'followers';
type CommentToggleType = CommentSortType;
type TriviaToggleType = 'spoilers' | 'no-spoilers';
type ProgressToggleType = 'in-progress' | 'dropped' | 'completed';

type Toggler<T, K> = {
  id: T;
  options: ToggleOption<K>[];
  default: K;
};

export type TogglerValueMap = {
  social: SocialToggleType;
  discover: DiscoverToggleType;
  comment: CommentToggleType;
  trivia: TriviaToggleType;
  progress: ProgressToggleType;
};

type ToggleDefinition<K extends TogglerId> = Toggler<K, TogglerValueMap[K]>;

const social: ToggleDefinition<'social'> = {
  id: 'social',
  default: 'following',
  options: [
    {
      value: 'following',
      text: m.button_text_following,
      label: m.button_label_following,
    },
    {
      value: 'followers',
      text: m.button_text_followers,
      label: m.button_label_followers,
    },
  ],
};

const discover: ToggleDefinition<'discover'> = {
  id: 'discover',
  default: 'media',
  options: [
    {
      value: 'media',
      text: m.button_text_media,
      label: m.button_label_media,
    },
    {
      value: 'show',
      text: m.button_text_shows,
      label: m.button_label_shows,
    },
    {
      value: 'movie',
      text: m.button_text_movies,
      label: m.button_label_movies,
    },
  ],
};

const comment: ToggleDefinition<'comment'> = {
  id: 'comment',
  default: 'likes',
  options: [
    {
      value: 'likes',
      text: m.button_text_popular_comments,
      label: m.button_label_popular_comments,
    },
    {
      value: 'newest',
      text: m.button_text_recent_comments,
      label: m.button_label_recent_comments,
    },
  ],
};

const trivia: ToggleDefinition<'trivia'> = {
  id: 'trivia',
  default: 'no-spoilers',
  options: [
    {
      value: 'no-spoilers',
      text: m.button_text_trivia_no_spoilers,
      label: m.button_label_trivia_no_spoilers,
    },
    {
      value: 'spoilers',
      text: m.button_text_trivia_spoilers,
      label: m.button_label_trivia_spoilers,
    },
  ],
};

const progress: ToggleDefinition<'progress'> = {
  id: 'progress',
  default: 'completed',
  options: [
    {
      value: 'completed',
      text: m.button_text_progress_completed,
      label: m.button_label_progress_completed,
    },
    {
      value: 'in-progress',
      text: m.button_text_progress_in_progress,
      label: m.button_label_progress_in_progress,
    },
    {
      value: 'dropped',
      text: m.button_text_progress_dropped,
      label: m.button_label_progress_dropped,
    },
  ],
};

export const TOGGLERS: {
  [K in TogglerId]: Toggler<K, TogglerValueMap[K]>;
} = {
  social,
  discover,
  comment,
  trivia,
  progress,
} as const;
