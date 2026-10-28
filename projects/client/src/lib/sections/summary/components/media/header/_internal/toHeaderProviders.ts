import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';

/**
 * Only the first few providers reach the header; the section chevron opens the
 * full view. Ordering is part of the design contract: subscription streaming
 * first (the user's preferred service ahead of the rest), then free, then
 * rent/buy.
 *
 * The limit is a parameter because the two directions have different room for it
 * - the masthead's three-column strip holds fewer than the anchored info rail,
 * and wants its columns to come out a comparable height.
 */
const HEADER_PROVIDER_LIMIT = 3;

export function toHeaderProviders(
  streamOn?: StreamOn,
  limit: number = HEADER_PROVIDER_LIMIT,
): ReadonlyArray<StreamingServiceOption> {
  const services = streamOn?.services;

  if (!services) {
    return [];
  }

  const preferred = streamOn.preferred;
  const streaming = services.streaming.filter(
    (service) => service.source !== preferred?.source,
  );

  return [
    ...(preferred ? [preferred] : []),
    ...streaming,
    ...services.free,
    ...services.onDemand,
  ].slice(0, limit);
}
