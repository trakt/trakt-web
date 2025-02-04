import { setupServer } from 'msw/node';
import { auth } from './handlers/auth';
import { calendars } from './handlers/calendars';
import { episodes } from './handlers/episodes';
import { movies } from './handlers/movies';
import { people } from './handlers/people';
import { recommendations } from './handlers/recommendations';
import { search } from './handlers/search';
import { shows } from './handlers/shows';
import { sync } from './handlers/sync';
import { users } from './handlers/users';
import { watchNow } from './handlers/watchNow';

const handlers = [
  ...users,
  ...movies,
  ...shows,
  ...episodes,
  ...sync,
  ...auth,
  ...people,
  ...watchNow,
  ...recommendations,
  ...calendars,
  ...search,
];

export const server = setupServer(...handlers);
