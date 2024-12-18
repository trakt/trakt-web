import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';

export const ExtendedUserMappedMock: UserSettings = {
  'id': '938a591b1337dcca76a513377bb25c6646057284',
  'avatar': {
    'url':
      'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
  },
  'cover': {
    'url': 'https://whirling_in_rags.jpg',
  },
  'isVip': true,
  'location': 'Martinaise, Revachol West',
  'name': {
    'first': 'Harry',
    'full': 'Harry Du Bois',
    'last': 'Du',
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
  },
  genres: [],
};
