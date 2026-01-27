import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import type { PersonalListType } from '$lib/sections/lists/user/models/PersonalListType.ts';
import { buildParamString } from './buildParamString.ts';

type TypeParams = {
  type: ExtendedMediaType | 'media';
};

type WellKnownQueryParams = {
  page?: number;
  watch_window?: number;
  status?: string;
  search?: string;
  display?: MediaType;
  library?: string;
  sort_by?: string;
  sort_how?: string;
};

type UrlBuilderParams =
  & TypeParams
  & Omit<WellKnownQueryParams, 'search'>
  & SearchParams;

function encodeRecord(
  params?: Record<string, string | number | boolean>,
): string | undefined {
  if (!params) {
    return undefined;
  }

  return encodeURIComponent(JSON.stringify(params));
}

export function decodeRecord(
  params: string,
): Record<string, string | number | boolean> {
  try {
    return JSON.parse(decodeURIComponent(params));
  } catch (_) {
    return {};
  }
}

function sanitizeParams(
  params: Omit<WellKnownQueryParams, 'search'> & SearchParams,
): WellKnownQueryParams {
  return {
    page: params.page,
    watch_window: params.watch_window,
    status: params.status,
    search: encodeRecord(params.search),
    display: params.display,
    sort_by: params.sort_by,
    sort_how: params.sort_how,
  };
}

const mediaDrilldownFactory =
  (category: string) => ({ type, ...params }: UrlBuilderParams) => {
    const typePath = type === 'media' ? type : `${type}s`;

    const baseUrl = `/${typePath}/${category}`;
    return baseUrl + buildParamString({
      ...sanitizeParams(params),
    });
  };

const categoryDrilldownFactory =
  (category: string) => ({ type, ...params }: UrlBuilderParams) => {
    const baseUrl = `/${category}/${type}s`;
    return baseUrl + buildParamString(sanitizeParams(params));
  };

const listsDrilldownFactory = (user: string) => (type: PersonalListType) => {
  switch (type) {
    case 'collaboration':
      return `/users/${user}/lists/view/collaborations`;
    default:
      return `/users/${user}/lists/view/${type}`;
  }
};

const ogIframeFactory = (url: HttpsUrl): HttpsUrl => {
  return `${url}/?embedded_mode=true`;
};

const ogIframeSlurmFactory = (url: HttpsUrl, token: string | Nil): HttpsUrl => {
  const tokenParam = token ? `&slurm=${token}` : '';
  return `${ogIframeFactory(url)}${tokenParam}`;
};

const ogIframeAccessTokenFactory = (url: HttpsUrl, token: string): HttpsUrl => {
  return `${
    ogIframeFactory(url)
  }&access_token=${token}&client_id=${TRAKT_CLIENT_ID}`;
};

const ogSupportFactory = (username?: string): HttpsUrl | MailToUrl => {
  const page = globalThis.location?.href ?? 'https://app.trakt.tv';
  const supportSubject = 'Trakt Support Request';
  const supportBody = 'Please describe your issue...';
  const supportDetails = username
    ? `**Username:** ${username}\n**Page:** ${page}`
    : `Page: ${page}`;

  const encodedBody = encodeURIComponent(
    `${supportBody}\n\n---\n\n${supportDetails}`,
  );

  if (!username) {
    return `mailto:support@trakt.tv?subject=${supportSubject}&body=${encodedBody}`;
  }

  return `https://forums.trakt.tv/new-message?username=support&title=${supportSubject}&body=${encodedBody}`;
};

export const UrlBuilder = {
  history: {
    category: (params: UrlBuilderParams) => {
      return categoryDrilldownFactory('history')(params);
    },
    all: ({ page }: UrlBuilderParams) => {
      return `/history${buildParamString({ page })}`;
    },
  },
  watched: (params: UrlBuilderParams) => {
    return categoryDrilldownFactory('watched')(params);
  },
  trending(params: UrlBuilderParams) {
    return mediaDrilldownFactory('trending')(params);
  },
  recommended(params: UrlBuilderParams) {
    return mediaDrilldownFactory('recommended')(params);
  },
  anticipated(params: UrlBuilderParams) {
    return mediaDrilldownFactory('anticipated')(params);
  },
  popular(params: UrlBuilderParams) {
    return mediaDrilldownFactory('popular')(params);
  },
  social: {
    activity: () => {
      return '/social/activity';
    },
  },
  progress: (user: string) => `/users/${user}/progress`,
  startWatching: (user: string) => `/users/${user}/start-watching`,
  home: () => '/',
  shows: () => '/shows',
  discover: () => '/discover',
  media: (type: MediaType, id: string) => {
    switch (type) {
      case 'show':
        return UrlBuilder.show(id);
      case 'movie':
        return UrlBuilder.movie(id);
    }
  },
  search: () => '/search',
  calendar: () => '/calendar',
  show: (id: string, params: Record<string, string | number> = {}) =>
    `/shows/${id}${buildParamString(params)}`,
  movies: () => '/movies',
  movie: (id: string) => `/movies/${id}`,
  people: (id: string) => `/people/${id}`,
  episode: (id: string, season: number, episode: number) =>
    `/shows/${id}/seasons/${season}/episodes/${episode}`,
  profile: {
    user: (username: string) => `/profile/${username}`,
    me: () => UrlBuilder.profile.user('me'),
  },
  users: (id: string) => ({
    lists: (slug: string, params: Record<string, string> = {}) =>
      `/users/${id}/lists/${slug}${
        buildParamString({ ...sanitizeParams(params), type: params.type })
      }`,
    yearToDate: (year: number) => `/users/${id}/year/${year}`,
    monthInReview: (year: number, month: number) =>
      `/users/${id}/mir/${year}/${month}`,
  }),
  library: {
    me: (library: string) => `/users/me/library?library=${library}`,
  },
  lists: {
    official: (id: number, params: Record<string, string | number> = {}) =>
      `/lists/official/${id}${
        buildParamString({ ...sanitizeParams(params), type: params.type })
      }`,
    user: (user: string, params?: UrlBuilderParams) => {
      if (!params) {
        return `/users/${user}/lists`;
      }

      return categoryDrilldownFactory(`users/${user}/lists`)(params);
    },
    watchlist: (user: string, params: Record<string, string | number> = {}) => {
      return `/users/${user}/watchlist${
        buildParamString(sanitizeParams(params))
      }`;
    },
    all: (user: string, type: PersonalListType) =>
      listsDrilldownFactory(user)(type),
  },
  app: {
    android: () => 'https://trakt.tv/a/trakt-android',
    ios: () => 'https://trakt.tv/a/trakt-ios',
  },
  github: {
    web: () => 'https://github.com/trakt/trakt-web',
    reportIssue: () => 'https://github.com/trakt/trakt-web/issues/new',
  },
  socialMedia: {
    x: () => 'https://x.com/trakt',
    instagram: () => 'https://www.instagram.com/trakt_app',
  },
  vip: () => 'https://trakt.tv/vip',
  og: {
    getVip: () => 'https://trakt.tv/vip',
    status: () => 'https://status.trakt.tv',
    privacy: () => 'https://trakt.tv/privacy',
    support: (username?: string) => ogSupportFactory(username),
    forums: () => 'https://forums.trakt.tv/c/trakt/trakt-lite/31',
    widgets: {
      yir: (slug: string, year: string) =>
        `https://widgets.trakt.tv/users/${slug}/yir.jpg?year=${year}`,
    },
    frame: {
      settings: (token: string) =>
        ogIframeAccessTokenFactory(
          'https://trakt.tv/settings/data',
          token,
        ),
      yearToDate: (slug: string, year: string, token: string | Nil) =>
        ogIframeSlurmFactory(
          `https://trakt.tv/users/${slug}/year/${year}`,
          token,
        ),
      monthInReview: (
        slug: string,
        year: string,
        month: string,
        token: string | Nil,
      ) =>
        ogIframeSlurmFactory(
          `https://trakt.tv/users/${slug}/mir/${year}/${month}`,
          token,
        ),
    },
  },
  settings: {
    general: () => '/settings',
    data: () => '/settings/data',
    advanced: () => '/settings/advanced',
  },
  external: {
    imdb: {
      person: (imdbId: string) => `https://www.imdb.com/name/${imdbId}`,
    },
    x: (username: string) => `https://x.com/${username}`,
    instagram: (username: string) => `https://www.instagram.com/${username}`,
    facebook: (username: string) => `https://www.facebook.com/${username}`,
  },
};
