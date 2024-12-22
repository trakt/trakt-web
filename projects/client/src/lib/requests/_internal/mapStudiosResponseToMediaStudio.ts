import type { StudiosResponse } from '$lib/api.ts';
import type { MediaStudio } from '$lib/models/MediaStudio.ts';

export function mapStudiosResponseToMediaStudio(
  studios: StudiosResponse,
): MediaStudio[] {
  return studios.map((studio) => ({
    name: studio.name,
    country: studio.country,
    ids: {
      slug: studio.ids.slug,
    },
  }));
}
