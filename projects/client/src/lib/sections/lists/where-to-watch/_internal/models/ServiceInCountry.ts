import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';

export type ServiceInCountry = {
  readonly key: string;
  readonly country: string;
  readonly countryName: string;
  readonly service: StreamingServiceOption;
};
