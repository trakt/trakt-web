import { RECOMMENDED_DEFAULT_WATCH_WINDOW } from '$lib/utils/constants.ts';

export function extractWatchWindowParam(params: URLSearchParams) {
  return {
    watch_window: parseInt(
      params.get('watch_window') ?? RECOMMENDED_DEFAULT_WATCH_WINDOW.toString(),
      10,
    ),
  };
}
