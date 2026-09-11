import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { MediaTypeSchema } from '$lib/requests/models/MediaType.ts';
import { shareImagePrefix } from './shareImagePrefix.ts';

export function buildTargetPrefixes(): ReadonlyArray<string> {
  const shareTypes = Object.keys(SHARE_TYPE_DIMENSIONS) as ShareType[];

  return shareTypes.flatMap((shareType) =>
    MediaTypeSchema.options.map((type) => shareImagePrefix({ shareType, type }))
  );
}
