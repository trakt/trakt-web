import { setupServer } from 'msw/node';
import { calendars } from './handlers/calendars.ts';
import { comments } from './handlers/comments.ts';
import { lists } from './handlers/lists.ts';
import { movies } from './handlers/movies.ts';
import { people } from './handlers/people.ts';
import { recommendations } from './handlers/recommendations.ts';
import { search } from './handlers/search.ts';
import { shows } from './handlers/shows.ts';
import { sync } from './handlers/sync.ts';
import { team } from './handlers/team.ts';
import { users } from './handlers/users.ts';
import { watchNow } from './handlers/watchNow.ts';

const handlers = [
  ...users,
  ...movies,
  ...shows,
  ...sync,
  ...people,
  ...watchNow,
  ...recommendations,
  ...calendars,
  ...search,
  ...lists,
  ...comments,
  ...team,
];

export const server = setupServer(...handlers);
