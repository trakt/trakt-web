import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { CostType } from '../getMediaCost.ts';

export type WhereToWatchCountryTileProps = {
  readonly service: StreamingServiceOption;
  readonly country: string;
  readonly countryName?: string;
  readonly type: CostType;
};
