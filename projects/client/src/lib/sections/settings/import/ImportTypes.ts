export type ImportSource =
  | 'imdb'
  | 'letterboxd'
  | 'tvtime'
  | 'trakt-json'
  | 'trakt-csv';

export const DEFAULT_IMPORT_SOURCE: ImportSource = 'tvtime';

export type ImportAction = 'history' | 'watchlist' | 'ratings';

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

export type StepSegment = string | { text: string; href: string };
export type ImportStep = StepSegment[];

export type ImportNote = string | { text: string; values: string[] };

export interface ImportGuidelineField {
  name: string;
  description: string;
  note?: ImportNote;
  optional?: boolean;
}

export interface ImportGuidelines {
  intro: string;
  fields: ImportGuidelineField[];
  example: string;
}

export interface ImportSourceGuide {
  title: string;
  description?: string;
  steps?: ImportStep[];
  guidelines?: ImportGuidelines;
}

export interface ImportSourceConfig {
  id: ImportSource;
  name: string;
  accept: string;
  maxFiles: number;
  guide: ImportSourceGuide;
}

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
      title: "Your TV Time isn't lost in space! 🚀",
      description:
        'Two ways to get your data out. Pick whichever suits you and import one export at a time:',
      steps: [
        [
          'Fastest: export your data with the',
          {
            text: 'TV Time Liberator extension',
            href:
              'https://chromewebstore.google.com/detail/tv-time-liberator-extensi/pohobkcjhigehafgnhehkanhjakajhpm',
          },
          'while your TV Time login still works, then upload the export .zip (or the activity_history.csv inside it) here',
        ],
        ['Official: request your GDPR data export on the', {
          text: 'TV Time privacy portal',
          href: 'https://gdpr.tvtime.com/gdpr/self-service',
        }],
        ["Once the export is ready you'll get two emails: one with a .zip file and another with a password to unlock it."],
        ['Upload the unlocked .zip here. If the .zip is not accepted, extract it and upload the two tracking-prod-records .csv files (plus followed_tv_show.csv and ratings-live-votes.csv for your watchlist and ratings) instead.'],
      ],
    },
  },
  imdb: {
    id: 'imdb',
    name: 'IMDb',
    accept: '.csv',
    maxFiles: 2,
    guide: {
      title: 'IMDb on Trakt? Lights, camera, action! ✨',
      description:
        "Download your IMDb watchlist as a .csv and import it here in seconds. It's as easy as 1, 2, Trakt! Here's how to get your .csv file:",
      steps: [
        ['Go to IMDb and login'],
        ['Visit your', {
          text: 'watchlist',
          href: 'https://www.imdb.com/list/watchlist',
        }],
        ['Click on Export'],
        ['Visit your', {
          text: 'ratings',
          href: 'https://www.imdb.com/list/ratings',
        }],
        ['Click on Export'],
        ['Upload the .csv files here'],
      ],
    },
  },
  letterboxd: {
    id: 'letterboxd',
    name: 'Letterboxd',
    accept: '.zip',
    maxFiles: 1,
    guide: {
      title: 'Bring your Letterboxd diary to Trakt! 🎬',
      description:
        "It's just a hop, skip, and a .zip away! Download your Letterboxd data and import it here. Here's the lowdown on getting that .zip:",
      steps: [
        ['Go to Letterboxd and login'],
        ['Open your', {
          text: 'Letterboxd Export settings',
          href: 'https://letterboxd.com/data/export/',
        }],
        ['Download your Letterboxd export data in a zip file and upload it here'],
      ],
    },
  },
  'trakt-json': {
    id: 'trakt-json',
    name: 'JSON',
    accept: '.json,.zip',
    maxFiles: 1,
    guide: {
      title: 'JSON aficionado? Perfect!',
      description:
        'Trakt welcomes your structured data with open arms. Upload your JSON file, making sure it follows our guidelines for a smooth and successful import.',
      guidelines: {
        intro:
          'Your JSON file should contain an array of objects. Each object represents an item to import.',
        fields: [
          {
            name: '"id": "string"',
            description:
              'The ID can be a Trakt ID, IMDB ID, or TMDB ID. For TV shows it can also be a TVDB ID.',
            note: {
              text: 'Prefix with the service name:',
              values: ['trakt_id', 'imdb_id', 'tmdb_id', 'tvdb_id'],
            },
          },
          {
            name: '"type": "string"',
            description:
              'Specifies what the ID refers to. Optional but recommended.',
            note: {
              text: 'Values:',
              values: ['movie', 'episode', 'show', 'season'],
            },
          },
          {
            name: '"watched_at": "string"',
            description: 'Date and time the item was watched. ISO 8601 format.',
            note:
              'Can be "unknown" to import with an unknown watch date. Omit if only adding to watchlist.',
            optional: true,
          },
          {
            name: '"watchlisted_at": "string"',
            description:
              'Date and time the item was added to your watchlist. ISO 8601 format.',
            note: 'Omit if only marking as watched.',
            optional: true,
          },
          {
            name: '"rating": "number"',
            description: 'Rating for the item. Must be a value from 1 to 10.',
            optional: true,
          },
          {
            name: '"rated_at": "string"',
            description: 'Date and time the item was rated. ISO 8601 format.',
            note: 'Only parsed if a rating is also present.',
            optional: true,
          },
        ],
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
      title: "Data in a grid? We've got you covered!",
      description:
        'Upload your CSV file and let Trakt organize your movie and TV show universe. Make sure your CSV is properly formatted with the fields described in the guidelines.',
      guidelines: {
        intro:
          'Your CSV file should contain a header row followed by one row per item to import.',
        fields: [
          {
            name: 'id',
            description:
              'The ID can be a Trakt ID, IMDB ID, or TMDB ID. For TV shows it can also be a TVDB ID.',
            note: {
              text: 'Prefix with the service name:',
              values: ['trakt_id', 'imdb_id', 'tmdb_id', 'tvdb_id'],
            },
          },
          {
            name: 'type',
            description:
              'Specifies what the ID refers to. Optional but recommended.',
            note: {
              text: 'Values:',
              values: ['movie', 'episode', 'show', 'season'],
            },
          },
          {
            name: 'watched_at',
            description: 'Date and time the item was watched. ISO 8601 format.',
            note:
              'Can be "unknown" to import with an unknown watch date. Omit if only adding to watchlist.',
            optional: true,
          },
          {
            name: 'watchlisted_at',
            description:
              'Date and time the item was added to your watchlist. ISO 8601 format.',
            note: 'Omit if only marking as watched.',
            optional: true,
          },
          {
            name: 'rating',
            description: 'Rating for the item. Must be a value from 1 to 10.',
            optional: true,
          },
          {
            name: 'rated_at',
            description: 'Date and time the item was rated. ISO 8601 format.',
            note: 'Only parsed if a rating is also present.',
            optional: true,
          },
        ],
        example: `imdb_id,type,watched_at,watchlisted_at,rating,rated_at
tt0068646,movie,2024-10-25T20:00:00Z,2024-10-01T10:00:00Z,7,2024-10-25T21:00:00Z
tt15239678,movie,,2024-04-30T11:00:00Z,,
tt4281724,movie,2024-01-12T02:00:00Z,,,`,
      },
    },
  },
};
