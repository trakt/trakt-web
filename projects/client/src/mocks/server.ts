import { setupServer } from 'msw/node';
import { apps } from './handlers/apps.ts';
import { calendars } from './handlers/calendars.ts';
import { comments } from './handlers/comments.ts';
import { intl } from './handlers/intl.ts';
import { lists } from './handlers/lists.ts';
import { movies } from './handlers/movies.ts';
import { people } from './handlers/people.ts';
import { plex } from './handlers/plex.ts';
import { recommendations } from './handlers/recommendations.ts';
import { search } from './handlers/search.ts';
import { shows } from './handlers/shows.ts';
import { streamingSync } from './handlers/streamingSync.ts';
import { sync } from './handlers/sync.ts';
import { team } from './handlers/team.ts';
import { users } from './handlers/users.ts';
import { watchNow } from './handlers/watchNow.ts';

const handlers = [
  ...apps,
  ...users,
  ...movies,
  ...shows,
  ...streamingSync,
  ...sync,
  ...people,
  ...plex,
  ...watchNow,
  ...recommendations,
  ...calendars,
  ...search,
  ...lists,
  ...comments,
  ...team,
  ...intl,
];

export const server = setupServer(...handlers);
