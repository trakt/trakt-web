import * as m from '$lib/features/i18n/messages.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ActivityType } from '$lib/sections/lists/activity/models/ActivityType.ts';
import type { ToggleOption } from '../ToggleOption.ts';

export type TogglerId =
  | 'activity'
  | 'media'
  | 'social'
  | 'discover'
  | 'comment';

type DiscoverToggleType = MediaType;
type MediaToggleType = MediaType | 'all';
type SocialToggleType = 'following' | 'followers';
type CommentToggleType = CommentSortType;

type Toggler<T, K> = {
  id: T;
  options: ToggleOption<K>[];
  default: K;
};

export type TogglerValueMap = {
  activity: ActivityType;
  media: MediaToggleType;
  social: SocialToggleType;
  discover: DiscoverToggleType;
  comment: CommentToggleType;
};

type ToggleDefinition<K extends TogglerId> = Toggler<K, TogglerValueMap[K]>;

const activity: ToggleDefinition<'activity'> = {
  id: 'activity',
  default: 'social',
  options: [
    {
      value: 'social',
      text: m.button_text_social,
      label: m.button_label_social,
    },
    {
      value: 'personal',
      text: m.button_text_personal,
      label: m.button_label_personal,
    },
  ],
};

const media: ToggleDefinition<'media'> = {
  id: 'media',
  default: 'all',
  options: [
    {
      value: 'all',
      text: m.button_text_all,
      label: m.button_label_all,
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
  default: 'show',
  options: [
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

export const TOGGLERS: {
  [K in TogglerId]: Toggler<K, TogglerValueMap[K]>;
} = {
  activity,
  media,
  social,
  discover,
  comment,
} as const;
