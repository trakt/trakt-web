import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type Permission,
  permissionSchema,
} from '$lib/requests/models/Permission.ts';
import { UserNameSchema } from '$lib/requests/models/UserName.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';
import { toUserName } from '$lib/utils/formatting/string/toUserName.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import {
  genreOptionSchema,
  type SettingsResponse,
  upNextSortOptionSchema,
} from '@trakt/api';
import { z } from 'zod';
import { Theme } from '../../theme/models/Theme.ts';

export const UserSettingsSchema = z.object({
  id: z.union([z.number(), z.string()]),
  key: z.string(),
  slug: z.string(),
  token: z.string().nullish(),
  name: UserNameSchema,
  username: z.string(),
  about: z.string().nullish(),
  location: z.string().optional(),
  joinedAt: z.date().optional(),
  avatar: z.object({
    url: z.string(),
  }),
  cover: z.object({
    url: z.string().nullish(),
  }),
  isVip: z.boolean(),
  isDirector: z.boolean(),
  isPrivate: z.boolean(),
  preferences: z.object({
    progress: z.object({
      sort: z.object({
        by: upNextSortOptionSchema,
        direction: z.enum(['asc', 'desc']).optional(),
      }),
    }),
    watch: z.object({
      action: z.enum(['now', 'released']),
    }),
    isSpoilerHidden: z.boolean().optional(),
  }),
  genres: genreOptionSchema.array(),
  services: z.object({
    country: z.string().nullish(),
    favorites: z.array(z.string()).optional(),
    showOnlyFavorites: z.boolean().optional(),
  }),
  permissions: permissionSchema.array(),
  limits: z.object({
    lists: z.object({
      limit: z.number(),
      itemLimit: z.number(),
    }),
  }),
  preferredTheme: z.nativeEnum(Theme),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

const PERMISSIONS_MAP: Record<
  keyof SettingsResponse['permissions'],
  Permission
> = {
  commenting: 'comment',
  liking: 'like',
  following: 'follow',
};

function mapToPreferredTheme(themeResponse?: string | Nil) {
  if (!themeResponse || themeResponse === 'true') {
    return Theme.Dark;
  }

  if (themeResponse === 'auto') {
    return Theme.System;
  }

  return Theme.Light;
}

function mapUserSettingsResponse(response: SettingsResponse): UserSettings {
  const { user, account, browsing } = response;

  const id = assertDefined(
    user.ids.trakt ?? user.ids.uuid,
    'Current user should have a valid ID',
  );

  return {
    id,
    key: `user-${id}`,
    slug: user.ids.slug,
    token: account.token,
    name: toUserName(user.name),
    username: user.username,
    about: user.about,
    location: user.location ?? '',
    joinedAt: new Date(user.joined_at),
    avatar: {
      url: prependHttps(user.images.avatar.full, DEFAULT_AVATAR),
    },
    cover: {
      url: prependHttps(
        findDefined(
          user.vip_cover_image,
          account.cover_image,
        ),
      ),
    },
    isVip: user.vip || user.vip_ep,
    isDirector: user.director,
    isPrivate: user.private,
    preferences: {
      watch: {
        action: browsing?.watch_popup_action === 'ask'
          ? 'now'
          : browsing?.watch_popup_action ?? 'now',
      },
      progress: {
        sort: {
          by: 'added',
          direction: browsing?.progress.on_deck.sort_how,
        },
      },
      isSpoilerHidden: [
        browsing?.spoilers.episodes,
        browsing?.spoilers.movies,
        browsing?.spoilers.shows,
      ]
        .some((topic) => topic?.includes('hide')),
    },
    genres: browsing?.genres.favorites ?? [],
    services: {
      country: browsing?.watchnow.country,
      favorites: browsing?.watchnow.favorites,
      showOnlyFavorites: browsing?.watchnow.only_favorites,
    },
    permissions: Object.entries(response.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => PERMISSIONS_MAP[key as keyof typeof PERMISSIONS_MAP]),
    limits: {
      lists: {
        limit: response.limits?.list.count ?? 0,
        itemLimit: response.limits?.list.item_count ?? 0,
      },
    },
    preferredTheme: mapToPreferredTheme(browsing?.dark_knight),
  };
}

const currentUserRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .settings({
      query: {
        extended: 'browsing',
      },
    });

export const currentUserQueryKey = ['userSettings'] as const;
export const currentUserSettingsQuery = defineQuery({
  key: 'currentUserSettings',
  invalidations: [
    InvalidateAction.User.Avatar,
    InvalidateAction.User.Settings,
    InvalidateAction.User.CoverImage,
  ],
  dependencies: [],
  request: currentUserRequest,
  mapper: (response) => mapUserSettingsResponse(response.body),
  schema: UserSettingsSchema,
  ttl: Infinity,
});
