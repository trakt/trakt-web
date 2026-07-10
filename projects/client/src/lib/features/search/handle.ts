import type { Handle } from '@sveltejs/kit';
import { mintSearchKeysFromEnv } from './mintSearchKeysFromEnv.ts';

export const handle: Handle = ({ event, resolve }) => {
  event.locals.typesense = mintSearchKeysFromEnv();

  return resolve(event);
};
