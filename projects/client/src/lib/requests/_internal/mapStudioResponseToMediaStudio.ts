import type { StudioResponse } from '$lib/api.ts';
import type { MediaStudio } from '$lib/models/MediaStudio.ts';

export function mapStudioResponseToMediaStudio(
  studio: StudioResponse,
): MediaStudio {
  return {
    name: studio.name,
    country: studio.country,
    ids: {
      slug: studio.ids.slug,
    },
  };
}
