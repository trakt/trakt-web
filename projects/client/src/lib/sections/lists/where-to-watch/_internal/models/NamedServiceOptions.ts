import type { CountryStreamingServiceOptions } from '$lib/requests/models/CountryStreamingServiceOptions.ts';

export type NamedServiceOptions = CountryStreamingServiceOptions & {
  countryName: string;
};
