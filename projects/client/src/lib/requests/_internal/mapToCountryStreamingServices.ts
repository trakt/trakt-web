import type { WatchNowResponse } from '@trakt/api';
import type { CountryStreamingServiceOptions } from '../models/CountryStreamingServiceOptions.ts';
import { mapToStreamingServices } from './mapToStreamingServices.ts';

export function mapToCountryStreamingServices(
  response: WatchNowResponse,
): CountryStreamingServiceOptions[] {
  const countries = Object.keys(response);

  return countries.map((country) => {
    const streamOn = mapToStreamingServices(response, country);

    return {
      country,
      services: [...streamOn.streaming, ...streamOn.onDemand],
    };
  });
}
