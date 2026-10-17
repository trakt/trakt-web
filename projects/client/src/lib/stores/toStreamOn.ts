import type { StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';
import { findPreferredStreamingService } from './_internal/findPreferredStreamingService.ts';

type ToStreamOnProps = {
  services: StreamingServiceOptions | Nil;
  favorites: string[];
  countryCode: string;
};

export function toStreamOn(
  { services, favorites, countryCode }: ToStreamOnProps,
) {
  if (!services) {
    return;
  }

  return {
    services,
    preferred: findPreferredStreamingService({
      services,
      favorites,
      countryCode,
    }),
  };
}
