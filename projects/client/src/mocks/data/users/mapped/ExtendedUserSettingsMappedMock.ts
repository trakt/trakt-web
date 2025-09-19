import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';

export const ExtendedUserMappedMock: UserSettings = {
  'id': 41152,
  'slug': 'tequila_sunset',
  'username': 'harrier_dubois',
  'token': null,
  'joinedAt': new Date('2021-03-15T08:00:00.000Z'),
  'avatar': {
    'url':
      'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
  },
  'cover': {
    'url': 'https://whirling_in_rags.jpg',
  },
  'about': "Sorry about the amnesia. I'm actually a superstar detective.",
  'isVip': true,
  'isDirector': false,
  'isPrivate': false,
  'location': 'Martinaise, Revachol West',
  'name': {
    'first': 'Harry',
    'full': 'Harry Du Bois',
    'last': 'Du Bois',
  },
  'preferences': {
    'progress': {
      'sort': {
        'by': 'added',
        'direction': 'asc',
      },
    },
    'watch': {
      'action': 'now',
    },
    'isSpoilerHidden': false,
  },
  'services': {
    'country': 'us',
    'favorites': ['netflix', 'max'],
    'showOnlyFavorites': true,
  },
  'genres': [],
  'permissions': ['comment', 'like', 'follow'],
  'limits': {
    'lists': {
      'limit': 100,
      'itemLimit': 1000,
    },
  },
};
