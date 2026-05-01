import { sortStreamingServices } from '$lib/requests/_internal/sortStreamingServices.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { GroupedServices } from './models/GroupedServices.ts';
import type { NamedServiceOptions } from './models/NamedServiceOptions.ts';
import type { ServiceAvailability } from './models/ServiceAvailability.ts';
import type { ServiceInCountry } from './models/ServiceInCountry.ts';
import { StreamingGroup } from './models/StreamingGroup.ts';
import { sortStreamingCountries } from './sortStreamingCountries.ts';

type CategorizedServices = Record<StreamingGroup, ServiceInCountry[]>;

type GetGroupedServicesProps = {
  readonly services: ReadonlyArray<NamedServiceOptions>;
  readonly userCountry: string;
  readonly favoriteSources: ReadonlyArray<string>;
};

function toServiceInCountry(country: string, countryName: string) {
  return (service: StreamingServiceOption): ServiceInCountry => ({
    key: `${service.key}-${country}`,
    country,
    countryName,
    service,
  });
}

function getServiceGroups(
  service: StreamingServiceOption,
): ReadonlyArray<StreamingGroup> {
  if (service.type === 'streaming') return [StreamingGroup.Subscription];
  if (service.type === 'free') return [StreamingGroup.Free];

  const groups: StreamingGroup[] = [];

  if (service.prices.rent) groups.push(StreamingGroup.Rent);
  if (service.prices.purchase) groups.push(StreamingGroup.Purchase);

  return groups;
}

function toServiceAvailability(userCountry: string) {
  return (
    [source, countries]: readonly [string, ServiceInCountry[]],
  ): ServiceAvailability => ({
    key: `service-${source}`,
    source,
    countries: sortStreamingCountries(countries, userCountry),
  });
}

function groupBySource(
  entries: ReadonlyArray<ServiceInCountry>,
  userCountry: string,
): ServiceAvailability[] {
  const bySource = Map.groupBy(entries, (entry) => entry.service.source);
  const services = Array.from(bySource.entries()).map(
    toServiceAvailability(userCountry),
  );
  return sortStreamingServices(services);
}

function groupServices(
  categorizedServices: CategorizedServices,
  userCountry: string,
): GroupedServices {
  return Object.fromEntries(
    Object.entries(categorizedServices).map(([category, entries]) => [
      category,
      groupBySource(entries, userCountry),
    ]),
  ) as GroupedServices;
}

export function getGroupedServices(
  { services, userCountry, favoriteSources }: GetGroupedServicesProps,
): GroupedServices {
  const favoriteSet = new Set(favoriteSources);

  const categorizedServices = services
    .flatMap((entry) =>
      entry.services.map(toServiceInCountry(entry.country, entry.countryName))
    )
    .reduce(
      (acc, entry) => {
        const groups = getServiceGroups(entry.service);
        groups.forEach((group) => acc[group].push(entry));

        const favoriteId = `${entry.country}-${entry.service.source}`;
        const isFavorite = favoriteSet.has(favoriteId);

        if (groups.length > 0 && isFavorite) {
          acc[StreamingGroup.Favorite].push(entry);
        }
        return acc;
      },
      {
        [StreamingGroup.Favorite]: [],
        [StreamingGroup.Subscription]: [],
        [StreamingGroup.Free]: [],
        [StreamingGroup.Purchase]: [],
        [StreamingGroup.Rent]: [],
      } as CategorizedServices,
    );

  return groupServices(categorizedServices, userCountry);
}
