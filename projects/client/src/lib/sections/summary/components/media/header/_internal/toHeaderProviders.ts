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
 * distinct services. A channel sold through another store folds into the
 * service it carries, as the same plan: "apple_tv_plus_amazon_channel" is
 * Apple TV, and the header shows only the primary mark, so two rows would
 * look identical. MUBI through Amazon stays MUBI, never Prime Video.
 *
 * The limit is a parameter because the two directions have different room for it
 * - the masthead's three-column strip holds fewer than the anchored info rail,
 * and wants its columns to come out a comparable height.
 */
const HEADER_PROVIDER_LIMIT = 3;

const PLAN_SUFFIX =
  /_(standard_with_ads|basic_with_ads|free_with_ads|with_ads|premium|standard|basic)$/;

const CHANNEL_SUFFIX = /_(amazon_channel|apple_tv_channel)$/;

/*
  Listings that are one service under two keys. Apple TV+ became Apple TV in
  2025, so both keys now show the same name; they are one row and one plan.
*/
const SAME_SERVICE: Readonly<Record<string, string>> = {
  apple_tv_plus: 'apple_tv',
};

const toCanonicalSource = (source: string) => {
  const carried = source.replace(CHANNEL_SUFFIX, '');
  return SAME_SERVICE[carried] ?? carried;
};

const toBaseSource = (source: string) =>
  toCanonicalSource(source).replace(PLAN_SUFFIX, '');

const toServiceKey = (service: StreamingServiceOption) =>
  `${service.type}:${toBaseSource(service.source)}`;

type PlanGroup = {
  lead: StreamingServiceOption;
  plans: ReadonlySet<string>;
};

/** The service's own plan leads its row; otherwise the first one listed. */
function addPlan(group: PlanGroup | undefined, service: StreamingServiceOption) {
  const plan = toCanonicalSource(service.source);

  if (!group) return { lead: service, plans: new Set([plan]) };

  const isBasePlan = service.source === toBaseSource(service.source);
  return {
    lead: isBasePlan ? service : group.lead,
    plans: new Set([...group.plans, plan]),
  };
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

  return [...groups].map(([key, { lead, plans }]) => ({
    key,
    service: lead,
    planCount: plans.size,
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
