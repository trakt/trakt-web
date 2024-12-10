import { i18n } from '$lib/features/i18n/index.ts';
import { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const _handle: Handle = ({ event, resolve }) => {
  return resolve(event);
};

export const handle: Handle = sequence(
  i18n.handle(),
  _handle,
);
