import type { PersonSchema } from '../../../search/schema/PersonSchema.ts';
import { toIds } from './toIds.ts';
import { toImageArray } from './toImageArray.ts';

export function toPerson(input: PersonSchema & { slug: string }) {
  return {
    name: input.name,
    ids: toIds(input),
    images: {
      headshot: toImageArray(input.headshot_url),
      fanart: [],
    },
    known_for_department: input.known_for_department,
  };
}
