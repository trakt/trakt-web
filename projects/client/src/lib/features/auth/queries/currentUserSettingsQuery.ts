import type {
  Genre,
  SettingsResponse,
  SortDirection,
  WatchAction,
} from '$lib/api.ts';
import { DEFAULT_COVER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

export type UserSettings = {
  id: string;
  slug: string;
  name: {
    full: string;
    first: string;
    last: string;
  };
  about?: string;
  location?: string;
  avatar: {
    url: string;
  };
  cover: {
    url: string;
  };
  isVip: boolean;
  preferences: {
    progress: {
      sort: {
        by?: string;
        direction?: SortDirection;
      };
    };
    watch: {
      action?: WatchAction;
    };
  };
  genres: Array<Genre>;
  watchNow: {
    country?: string;
    favorites?: string[];
    showOnlyFavorites?: boolean;
  };
};

function mapUserSettingsResponse(response: SettingsResponse): UserSettings {
  const { user, account, browsing } = response;
  const fullName = user.name;
  const [firstName = '', lastName = ''] = user.name.split(' ');

  return {
    id: user.ids.uuid,
    slug: user.ids.slug,
    name: {
      full: fullName,
      first: firstName,
      last: lastName,
    },
    about: user.about,
    location: user.location,
    avatar: {
      url: user.images.avatar.full,
    },
    cover: {
      url: prependHttps(
        findDefined(
          user.vip_cover_image,
          account.cover_image,
        ),
        DEFAULT_COVER,
      ),
    },
    isVip: user.vip || user.vip_ep,
    preferences: {
      watch: {
        action: browsing?.watch_popup_action,
      },
      progress: {
        sort: {
          by: browsing?.progress.on_deck.sort,
          direction: browsing?.progress.on_deck.sort_how,
        },
      },
    },
    genres: browsing?.genres.favorites ?? [],
    watchNow: {
      country: browsing?.watchnow.country,
      favorites: browsing?.watchnow.favorites,
      showOnlyFavorites: browsing?.watchnow.only_favorites,
    },
  };
}

const currentUserRequest = ({ fetch }: ApiParams): Promise<UserSettings> =>
  api({ fetch })
    .users
    .settings({
      query: {
        extended: 'browsing',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching current user', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching current user.');
      }

      return response.body;
    })
    .then(mapUserSettingsResponse);

export const currentUserQueryKey = ['userSettings'] as const;
export const currentUserSettingsQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: currentUserQueryKey,
  queryFn: () => currentUserRequest({ fetch }),
});
