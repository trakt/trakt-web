import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';

/** One service in the header's watch list, with how many plans it folds in. */
export type HeaderProvider = {
  key: string;
  service: StreamingServiceOption;
  planCount: number;
};
