import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { HeaderProvider } from './HeaderProvider.ts';

/**
 * Only the first few providers reach the header; the section chevron opens the
 * full view. Ordering is part of the design contract: subscription streaming
 * first (the user's preferred service ahead of the rest), then free, then
 * rent/buy.
 *
 * Plans of one service ("netflix" and "netflix_standard_with_ads") fold into a
 * single row that counts them, before the limit, so the rows shown are
 * distinct services. Only plan suffixes fold: channels sold through another
 * store ("mubi_amazon_channel") stay services of their own.
 *
 * The limit is a parameter because the two directions have different room for it
 * - the masthead's three-column strip holds fewer than the anchored info rail,
 * and wants its columns to come out a comparable height.
 */
const HEADER_PROVIDER_LIMIT = 3;

const PLAN_SUFFIX =
  /_(standard_with_ads|basic_with_ads|free_with_ads|with_ads|premium|standard|basic)$/;

const toBaseSource = (source: string) => source.replace(PLAN_SUFFIX, '');

const toServiceKey = (service: StreamingServiceOption) =>
  `${service.type}:${toBaseSource(service.source)}`;

type PlanGroup = { lead: StreamingServiceOption; count: number };

/** The service's own plan leads its row; otherwise the first one listed. */
function addPlan(group: PlanGroup | undefined, service: StreamingServiceOption) {
  if (!group) return { lead: service, count: 1 };

  const isBasePlan = service.source === toBaseSource(service.source);
  return { lead: isBasePlan ? service : group.lead, count: group.count + 1 };
}

function foldPlans(
  services: ReadonlyArray<StreamingServiceOption>,
): ReadonlyArray<HeaderProvider> {
  const groups = services.reduce(
    (folded, service) => {
      const key = toServiceKey(service);
      return new Map(folded).set(key, addPlan(folded.get(key), service));
    },
    new Map<string, PlanGroup>(),
  );

  return [...groups].map(([key, { lead, count }]) => ({
    key,
    service: lead,
    planCount: count,
  }));
}

export function toHeaderProviders(
  streamOn?: StreamOn,
  limit: number = HEADER_PROVIDER_LIMIT,
): ReadonlyArray<HeaderProvider> {
  const services = streamOn?.services;

  if (!services) {
    return [];
  }

  const preferred = streamOn.preferred;
  const streaming = services.streaming.filter(
    (service) => service.source !== preferred?.source,
  );

  return foldPlans([
    ...(preferred ? [preferred] : []),
    ...streaming,
    ...services.free,
    ...services.onDemand,
  ]).slice(0, limit);
}
