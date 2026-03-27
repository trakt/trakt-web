import type { MediaVideo } from '$lib/requests/models/MediaVideo';
import { assertDefined } from '$lib/utils/assert/assertDefined';
import { writable } from '$lib/utils/store/WritableSubject.ts';

export function useVideoTypes(videos: MediaVideo[]) {
  const record = videos.reduce(
    (acc, video) => {
      acc[video.type] = acc[video.type] || [];
      acc[video.type].push(video);
      return acc;
    },
    {} as Record<string, MediaVideo[]>,
  );

  const types = Object.keys(record) as Array<MediaVideo['type']>;
  const firstType = assertDefined(
    types.at(0),
    'useVideoTypes: No video types found',
  );
  const active = writable(firstType);

  return { record, types, active };
}
