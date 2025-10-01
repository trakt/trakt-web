import { unixToDate } from '../../../../utils/date/unixToDate.ts';
import { unixToDateTime } from '../../../../utils/date/unixToDateTime.ts';
import { prependHttps } from '../../../../utils/url/prependHttps.ts';
import type { PersonSchema } from '../../../search/schema/PersonSchema.ts';
import { toIds } from './toIds.ts';
import { toImageArray } from './toImageArray.ts';

export function toPerson(input: PersonSchema) {
  return {
    name: input.name,
    ids: toIds(input),
    images: {
      headshot: toImageArray(input.headshot_url),
      fanart: toImageArray(input.fanart_url),
    },
    social_ids: {
      twitter: input.twitter_id,
      facebook: input.facebook_id,
      instagram: input.instagram_id,
      wikipedia: input.wikipedia_id,
    },
    biography: input.biography,
    birthday: unixToDate(input.birthday),
    death: unixToDate(input.death),
    birthplace: input.birthplace,
    homepage: prependHttps(input.homepage),
    known_for_department: input.known_for_department,
    gender: input.gender,
    updated_at: unixToDateTime(input.updated_at),
  };
}
