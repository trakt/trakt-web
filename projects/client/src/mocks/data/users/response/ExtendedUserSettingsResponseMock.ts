import type { SettingsResponse } from '@trakt/api';

export const ExtendedUsersResponseMock: SettingsResponse = {
  'user': {
    'username': 'harrier_dubois',
    'private': false,
    'name': 'Harry Du Bois',
    'vip': true,
    'vip_ep': true,
    'director': false,
    'ids': {
      'slug': 'tequila_sunset',
      'trakt': 41152,
      'uuid': '938a591b1337dcca76a513377bb25c6646057284',
    },
    'joined_at': '2021-03-15T08:00:00.000Z',
    'location': 'Martinaise, Revachol West',
    'about': "Sorry about the amnesia. I'm actually a superstar detective.",
    'gender': 'male',
    'age': 44,
    'images': {
      'avatar': {
        'full':
          'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
      },
    },
    'vip_og': true,
    'vip_years': 3,
    'vip_cover_image': 'whirling_in_rags.jpg',
    'dob': '1977-03-21',
  },
  'permissions': {
    'commenting': true,
    'liking': true,
    'following': true,
  },
  'account': {
    'timezone': 'Europe/Amsterdam',
    'date_format': 'dmy',
    'time_24hr': true,
    'cover_image': null,
    'token': null,
    'display_ads': true,
  },
  'browsing': {
    'watch_popup_action': 'now',
    'hide_watching_now': false,
    'list_popup_action': 'ask',
    'week_start_day': '0',
    'watch_after_rating': '',
    'watch_only_once': false,
    'other_site_ratings': true,
    'release_date_ignore_runtime': false,
    'display_early_ratings': false,
    'hide_episode_type_tags': false,
    'hide_unsaved_filters_prompt': false,
    'spoilers': {
      'episodes': 'show',
      'shows': null,
      'movies': null,
      'comments': null,
      'ratings': null,
      'actors': null,
    },
    'calendar': {
      'period': 'week',
      'start_day': 'today',
      'layout': 'list',
      'image_type': null,
      'hide_specials': false,
      'autoscroll': false,
    },
    'progress': {
      'on_deck': {
        'sort': 'added',
        'sort_how': 'asc',
        'refresh': true,
        'simple_progress': false,
        'only_favorites': false,
      },
      'watched': {
        'refresh': true,
        'simple_progress': false,
        'include_specials': false,
        'include_watchlisted': true,
        'include_collected': false,
        'sort': 'plays',
        'sort_how': 'asc',
        'use_last_activity': true,
        'grid_view': false,
      },
    },
    'dark_knight': 'false',
    'app_theme': 'purple',
    'welcome': {
      'completed_at': '2024-09-12T12:27:38.000Z',
      'exit_step': null,
    },
    'genres': {
      'favorites': null,
      'disliked': null,
    },
    'comments': {
      'blocked_uids': [],
    },
    'recommendations': {
      'ignore_collected': false,
      'ignore_watchlisted': false,
    },
    'rewatching': {
      'adjust_percentage': false,
    },
    'profile': {
      'favorites': {
        'sort_by': 'random',
        'sort_how': 'asc',
      },
      'most_watched_shows': {
        'sort_by': 'plays',
        'tab': 'last_30_days',
      },
      'most_watched_movies': {
        'sort_by': 'time',
        'tab': 'last_30_days',
      },
    },
    'watchnow': {
      'country': 'us',
      'favorites': ['netflix', 'max'],
      'only_favorites': true,
    },
  },
  'limits': {
    'list': {
      'count': 100,
      'item_count': 1000,
    },
    'favorites': {
      'item_count': 100,
    },
    'watchlist': {
      'item_count': 100,
    },
  },
};
