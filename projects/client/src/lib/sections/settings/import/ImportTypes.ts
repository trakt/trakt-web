import * as m from '$lib/features/i18n/messages.ts';

export type ImportSource =
  | 'imdb'
  | 'letterboxd'
  | 'tvtime'
  | 'trakt-json'
  | 'trakt-csv';

export const DEFAULT_IMPORT_SOURCE: ImportSource = 'tvtime';

export type ImportAction = 'history' | 'watchlist' | 'ratings';

export type ImportActionSelection = Record<ImportAction, boolean>;

export type ImportType = 'movie' | 'show' | 'episode';

export type ImportStatus =
  | 'idle'
  | 'reading'
  | 'parsing'
  | 'review'
  | 'matching'
  | 'syncing'
  | 'complete'
  | 'error';

export interface ImportIds {
  trakt?: number;
  imdb?: string;
  tmdb?: number;
  tvdb?: number;
}

export interface UniversalImportItem {
  action: ImportAction;
  type: ImportType;
  ids: ImportIds;
  title?: string;
  year?: number;
  watched_at?: string;
  rating?: number;
  rated_at?: string;
  season?: number;
  episode?: number;
}

export interface ImportCounts {
  history: number;
  watchlist: number;
  ratings: number;
}

export interface MovieMatchCandidate {
  title: string;
  year?: number;
  poster?: string;
  ids: ImportIds;
}

export interface AmbiguousImportItem {
  item: UniversalImportItem;
  candidates: MovieMatchCandidate[];
}

export interface ImportSyncResult {
  errorCount: number;
  unresolved: UniversalImportItem[];
  ambiguous: AmbiguousImportItem[];
}

/**
 * Resolves a translatable message at render time. Stored as a reference (never
 * called at module load) so the guide reacts to locale changes.
 */
type MessageGetter = () => string;

export interface GuideStep {
  text: MessageGetter;
  href?: string;
}

export interface StructuredImportNote {
  text: MessageGetter;
  values: string[];
}

export type ImportNote = MessageGetter | StructuredImportNote;

export interface ImportGuidelineField {
  name: string;
  description: MessageGetter;
  note?: ImportNote;
  optional?: boolean;
}

export interface ImportGuidelines {
  intro: MessageGetter;
  fields: ImportGuidelineField[];
  example: string;
}

export interface ImportSourceGuide {
  title: MessageGetter;
  description?: MessageGetter;
  steps?: GuideStep[];
  guidelines?: ImportGuidelines;
}

export interface ImportSourceConfig {
  id: ImportSource;
  name: string;
  accept: string;
  maxFiles: number;
  guide: ImportSourceGuide;
}

interface TraktFieldNames {
  id: string;
  type: string;
  watchedAt: string;
  watchlistedAt: string;
  rating: string;
  ratedAt: string;
}

/**
 * JSON and CSV share identical field descriptions/notes - only the code field
 * names and the example block differ. Build the field list from the shared
 * messages, injecting the format-specific names.
 */
const buildTraktGuidelineFields = (
  names: TraktFieldNames,
): ImportGuidelineField[] => [
  {
    name: names.id,
    description: m.import_guide_field_id_description,
    note: {
      text: m.import_guide_field_id_note,
      values: ['trakt_id', 'imdb_id', 'tmdb_id', 'tvdb_id'],
    },
  },
  {
    name: names.type,
    description: m.import_guide_field_type_description,
    note: {
      text: m.import_guide_field_type_note,
      values: ['movie', 'episode', 'show', 'season'],
    },
  },
  {
    name: names.watchedAt,
    description: m.import_guide_field_watched_at_description,
    note: m.import_guide_field_watched_at_note,
    optional: true,
  },
  {
    name: names.watchlistedAt,
    description: m.import_guide_field_watchlisted_at_description,
    note: m.import_guide_field_watchlisted_at_note,
    optional: true,
  },
  {
    name: names.rating,
    description: m.import_guide_field_rating_description,
    optional: true,
  },
  {
    name: names.ratedAt,
    description: m.import_guide_field_rated_at_description,
    note: m.import_guide_field_rated_at_note,
    optional: true,
  },
];

export const IMPORT_SOURCE_CONFIGS: Record<
  ImportSource,
  ImportSourceConfig
> = {
  tvtime: {
    id: 'tvtime',
    name: 'TV Time',
    accept: '.csv,.zip',
    // High enough to swallow a whole extracted GDPR folder (41 files);
    // unrecognized files are filtered out by the parser.
    maxFiles: 50,
    guide: {
      title: m.import_guide_tvtime_title,
      description: m.import_guide_tvtime_description,
      steps: [
        {
          text: m.import_guide_tvtime_step_1,
          href:
            'https://chromewebstore.google.com/detail/tv-time-liberator-extensi/pohobkcjhigehafgnhehkanhjakajhpm',
        },
        {
          text: m.import_guide_tvtime_step_2,
          href: 'https://gdpr.tvtime.com/gdpr/self-service',
        },
        { text: m.import_guide_tvtime_step_3 },
        { text: m.import_guide_tvtime_step_4 },
      ],
    },
  },
  imdb: {
    id: 'imdb',
    name: 'IMDb',
    accept: '.csv',
    maxFiles: 2,
    guide: {
      title: m.import_guide_imdb_title,
      description: m.import_guide_imdb_description,
      steps: [
        { text: m.import_guide_imdb_step_1 },
        {
          text: m.import_guide_imdb_step_2,
          href: 'https://www.imdb.com/list/watchlist',
        },
        { text: m.import_guide_imdb_step_3 },
        {
          text: m.import_guide_imdb_step_4,
          href: 'https://www.imdb.com/list/ratings',
        },
        { text: m.import_guide_imdb_step_5 },
        { text: m.import_guide_imdb_step_6 },
      ],
    },
  },
  letterboxd: {
    id: 'letterboxd',
    name: 'Letterboxd',
    accept: '.zip',
    maxFiles: 1,
    guide: {
      title: m.import_guide_letterboxd_title,
      description: m.import_guide_letterboxd_description,
      steps: [
        { text: m.import_guide_letterboxd_step_1 },
        {
          text: m.import_guide_letterboxd_step_2,
          href: 'https://letterboxd.com/data/export/',
        },
        { text: m.import_guide_letterboxd_step_3 },
      ],
    },
  },
  'trakt-json': {
    id: 'trakt-json',
    name: 'JSON',
    accept: '.json,.zip',
    maxFiles: 1,
    guide: {
      title: m.import_guide_json_title,
      description: m.import_guide_json_description,
      guidelines: {
        intro: m.import_guide_json_intro,
        fields: buildTraktGuidelineFields({
          id: '"id": "string"',
          type: '"type": "string"',
          watchedAt: '"watched_at": "string"',
          watchlistedAt: '"watchlisted_at": "string"',
          rating: '"rating": "number"',
          ratedAt: '"rated_at": "string"',
        }),
        example: `[
  {
    "imdb_id": "tt0068646",
    "type": "movie",
    "watched_at": "2024-10-25T20:00:00Z",
    "watchlisted_at": "2024-10-01T10:00:00Z",
    "rating": 6,
    "rated_at": "2024-10-26T21:00:00Z"
  },
  {
    "imdb_id": "tt15239678",
    "type": "movie",
    "watchlisted_at": "2024-04-30T11:00:00Z",
    "rating": 9,
    "rated_at": "2024-10-25T21:00:00Z"
  },
  {
    "imdb_id": "tt4281724",
    "type": "movie",
    "watched_at": "2024-01-12T02:00:00Z"
  }
]`,
      },
    },
  },
  'trakt-csv': {
    id: 'trakt-csv',
    name: 'CSV',
    accept: '.csv',
    maxFiles: 1,
    guide: {
      title: m.import_guide_csv_title,
      description: m.import_guide_csv_description,
      guidelines: {
        intro: m.import_guide_csv_intro,
        fields: buildTraktGuidelineFields({
          id: 'id',
          type: 'type',
          watchedAt: 'watched_at',
          watchlistedAt: 'watchlisted_at',
          rating: 'rating',
          ratedAt: 'rated_at',
        }),
        example: `imdb_id,type,watched_at,watchlisted_at,rating,rated_at
tt0068646,movie,2024-10-25T20:00:00Z,2024-10-01T10:00:00Z,7,2024-10-25T21:00:00Z
tt15239678,movie,,2024-04-30T11:00:00Z,,
tt4281724,movie,2024-01-12T02:00:00Z,,,`,
      },
    },
  },
};
