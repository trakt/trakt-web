import { prependStorageHost } from './prependStorageHost.ts';

type ToImageArrayProps = {
  type: 'movies' | 'shows' | 'people';
  id: string;
  slot: 'poster' | 'headshot';
};

export const toImageArray = ({ type, id, slot }: ToImageArrayProps) => {
  return [prependStorageHost(`${type}/${id}/medium/${slot}`, '.webp')];
};
