import type { TagType } from '../models/TagType.ts';
import type { TagIntl } from '../TagIntl.ts';

export type AirDateTagProps = {
  airDate: Date;
  year?: number | Nil;
  i18n: TagIntl;
  type?: TagType;
};
