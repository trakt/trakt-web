import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '../../../requests/models/MediaType.ts';
import type { ActivityType } from '../../../sections/lists/activity/models/ActivityType.ts';
import type { ToggleOption } from '../ToggleOption.ts';

export type TogglerId = 'activity' | 'media' | 'social';

type MediaToggleType = MediaType | 'all';
type SocialToggleType = 'following' | 'followers';

type Toggler<T, K> = {
  id: T;
  options: ToggleOption<K>[];
  default: K;
};

export type TogglerValueMap = {
  activity: ActivityType;
  media: MediaToggleType;
  social: SocialToggleType;
};

type ToggleDefinition<K extends TogglerId> = Toggler<K, TogglerValueMap[K]>;

const activity: ToggleDefinition<'activity'> = {
  id: 'activity',
  default: 'social',
  options: [
    {
      value: 'social',
      text: m.button_text_social(),
      label: m.button_label_social(),
    },
    {
      value: 'personal',
      text: m.button_text_personal(),
      label: m.button_label_personal(),
    },
  ],
};

const media: ToggleDefinition<'media'> = {
  id: 'media',
  default: 'all',
  options: [
    {
      value: 'all',
      text: m.button_text_all(),
      label: m.button_label_all(),
    },
    {
      value: 'show',
      text: m.button_text_shows(),
      label: m.button_label_shows(),
    },
    {
      value: 'movie',
      text: m.button_text_movies(),
      label: m.button_label_movies(),
    },
  ],
};

const social: ToggleDefinition<'social'> = {
  id: 'social',
  default: 'following',
  options: [
    {
      value: 'following',
      text: m.button_text_following(),
      label: m.button_label_following(),
    },
    {
      value: 'followers',
      text: m.button_text_followers(),
      label: m.button_label_followers(),
    },
  ],
};

export const TOGGLERS: {
  [K in TogglerId]: Toggler<K, TogglerValueMap[K]>;
} = {
  activity,
  media,
  social,
} as const;
