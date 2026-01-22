import { error } from '$lib/utils/console/print.ts';
import { strToU8, zip, type Zippable } from 'fflate';
import { downloadFile } from './downloadFile.ts';
import { processEndpoint } from './processEndpoint.ts';

type UserLike = {
  slug: string;
  isVip: boolean;
};

interface TraktList {
  ids: {
    trakt: number;
    slug: string;
  };
}

type ExportStatus =
  | { type: 'fetch'; item: string }
  | { type: 'zip' }
  | { type: 'complete' };

interface ExportOptions {
  user: UserLike;
  onStatus: (status: ExportStatus) => void;
  onProgress: (msg: string) => void;
  onComplete: () => void;
  onError: (err: unknown) => void;
}

export async function runRawExport({
  user,
  onStatus,
  onProgress,
  onComplete,
  onError,
}: ExportOptions) {
  const { slug, isVip } = user;
  const files: Zippable = {};

  // Define all endpoints
  const endpoints = [
    // user
    {
      path: 'users/settings?extended=sharing,browsing,gdpr',
      file: 'user-settings',
    },
    { path: `users/${slug}?extended=full,vip`, file: 'user-profile' },
    { path: 'sync/last_activities', file: 'user-last-activities' },
    { path: `users/${slug}/stats`, file: 'user-stats' },
    ...(isVip
      ? [{ path: 'users/saved_filters', file: 'user-saved-filters' }]
      : []),

    // hidden
    { path: 'users/hidden/calendar', file: 'hidden-calendar' },
    {
      path: 'users/hidden/progress_watched',
      file: 'hidden-progress-watched',
    },
    {
      path: 'users/hidden/progress_watched_reset',
      file: 'hidden-progress-watched-reset',
    },
    {
      path: 'users/hidden/progress_collected',
      file: 'hidden-progress-collected',
    },
    { path: 'users/hidden/recommendations', file: 'hidden-recommendations' },

    // friends/network
    { path: 'users/requests', file: 'network-followers-requests' },
    { path: `users/${slug}/followers`, file: 'network-followers' },
    { path: `users/${slug}/following`, file: 'network-following' },
    { path: `users/${slug}/friends`, file: 'network-friends' },

    // likes
    { path: 'users/likes/comments', file: 'likes-comments' },
    { path: 'users/likes/lists', file: 'likes-lists' },

    // comments
    {
      path: `users/${slug}/comments/all/movies?include_replies=true`,
      file: 'comments-movies',
    },
    {
      path: `users/${slug}/comments/all/shows?include_replies=true`,
      file: 'comments-shows',
    },
    {
      path: `users/${slug}/comments/all/seasons?include_replies=true`,
      file: 'comments-seasons',
    },
    {
      path: `users/${slug}/comments/all/episodes?include_replies=true`,
      file: 'comments-episodes',
    },
    {
      path: `users/${slug}/comments/all/lists?include_replies=true`,
      file: 'comments-lists',
    },

    // notes (valid types: movies, shows, seasons, episodes, people)
    {
      path: `users/${slug}/notes/movies?extended=gdpr`,
      file: 'notes-movies',
    },
    { path: `users/${slug}/notes/shows?extended=gdpr`, file: 'notes-shows' },
    {
      path: `users/${slug}/notes/seasons?extended=gdpr`,
      file: 'notes-seasons',
    },
    {
      path: `users/${slug}/notes/episodes?extended=gdpr`,
      file: 'notes-episodes',
    },
    {
      path: `users/${slug}/notes/people?extended=gdpr`,
      file: 'notes-people',
    },
    {
      path: `users/${slug}/notes/activities?extended=gdpr`,
      file: 'notes-activities',
    },
    {
      path: `users/${slug}/notes/collection_items?extended=gdpr`,
      file: 'notes-collection_items',
    },
    {
      path: `users/${slug}/notes/ratings?extended=gdpr`,
      file: 'notes-ratings',
    },

    // ratings
    { path: `users/${slug}/ratings/movies`, file: 'ratings-movies' },
    { path: `users/${slug}/ratings/shows`, file: 'ratings-shows' },
    { path: `users/${slug}/ratings/seasons`, file: 'ratings-seasons' },
    { path: `users/${slug}/ratings/episodes`, file: 'ratings-episodes' },

    // watched
    { path: `users/${slug}/watched/movies`, file: 'watched-movies' },
    { path: `users/${slug}/watched/shows`, file: 'watched-shows' },
    { path: `users/${slug}/history?extended=gdpr`, file: 'watched-history' },
    { path: 'sync/playback?extended=gdpr', file: 'watched-playback' },

    // collection
    {
      path: `users/${slug}/collection/movies?extended=metadata,gdpr`,
      file: 'collection-movies',
    },
    {
      path: `users/${slug}/collection/shows?extended=metadata,gdpr`,
      file: 'collection-shows',
    },
    {
      path: `users/${slug}/collection/episodes?extended=metadata,gdpr`,
      file: 'collection-episodes',
    },

    // lists
    { path: `users/${slug}/watchlist`, file: 'lists-watchlist' },
    { path: `users/${slug}/favorites`, file: 'lists-favorites' },
    {
      path: `users/${slug}/lists/collaborations`,
      file: 'lists-collaborations',
    },
    { path: `users/${slug}/lists`, file: 'lists-lists' },
  ];

  try {
    // Fetch dynamic list endpoints
    onStatus({ type: 'fetch', item: 'lists' });

    await processEndpoint(`users/${slug}/lists`, (data) => {
      const lists = data as TraktList[];
      for (const list of lists) {
        endpoints.push({
          path: `users/${slug}/lists/${list.ids.slug}/items`,
          file: `lists-list-${list.ids.trakt}-${list.ids.slug}`,
        });
      }
    });

    let count = 0;
    for (const endpoint of endpoints) {
      count++;
      onProgress(`(${count}/${endpoints.length})`);
      onStatus({ type: 'fetch', item: endpoint.file });

      await processEndpoint(endpoint.path, (data, { page, pageCount }) => {
        const suffix = page > 1 || pageCount > 1 ? `-${page}` : '';
        const filename = `${endpoint.file}${suffix}.json`;
        files[filename] = strToU8(JSON.stringify(data, null, 2));
      });
    }

    onStatus({ type: 'zip' });
    zip(files, (err, out) => {
      if (err) {
        error('Zip failed', err);
        onError(err);
        return;
      }
      const blob = new Blob([out as unknown as BlobPart], {
        type: 'application/zip',
      });

      downloadFile(blob, `trakt-export-${slug}.zip`);
      onStatus({ type: 'complete' });
      onComplete();
    });
  } catch (e) {
    error('Export failed', e);
    onError(e);
  }
}
