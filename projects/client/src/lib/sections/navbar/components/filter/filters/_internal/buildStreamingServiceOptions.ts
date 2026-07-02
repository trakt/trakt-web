import { getWellKnownSourceGroup } from '$lib/components/media/streaming-service/getWellKnownSourceGroup.ts';
import { sortStreamingServices } from '$lib/requests/_internal/sortStreamingServices.ts';
import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import type {
  StreamingBrandOption,
  StreamingServiceOption,
  StreamingServiceOptions,
} from './StreamingServiceOptions.ts';

const simpleServiceLimit = 5;

type BuildStreamingServiceOptionsParams = {
  countryCode: string;
  favorites: ReadonlyArray<string>;
  sourceMap: ReadonlyMap<string, ReadonlyArray<StreamingSource>>;
};

function toServiceOption(source: StreamingSource): StreamingServiceOption {
  return {
    source: source.source,
    name: source.name,
    hasLogo: source.logoUrl != null,
  };
}

function toFavoriteSlug(
  favorite: string,
  countryCode: string,
  bySlug: ReadonlyMap<string, StreamingSource>,
): string | undefined {
  const prefix = `${countryCode}-`;

  if (favorite.startsWith(prefix)) {
    return favorite.slice(prefix.length);
  }

  if (bySlug.has(favorite)) {
    return favorite;
  }

  return undefined;
}

function toBrandKey(source: string): string {
  return getWellKnownSourceGroup(source) ?? source;
}

function toBrandOptions(
  services: ReadonlyArray<StreamingSource>,
): StreamingBrandOption[] {
  const grouped = sortStreamingServices(services).reduce(
    (acc, service) => {
      const key = toBrandKey(service.source);
      const current = acc.get(key);

      if (current) {
        acc.set(key, {
          ...current,
          source: current.hasLogo || service.logoUrl == null
            ? current.source
            : service.source,
          slugs: [...current.slugs, service.source],
          hasLogo: current.hasLogo || service.logoUrl != null,
        });
        return acc;
      }

      acc.set(key, {
        key,
        name: service.name,
        source: service.source,
        color: service.color ?? undefined,
        slugs: [service.source],
        hasLogo: service.logoUrl != null,
      });
      return acc;
    },
    new Map<string, StreamingBrandOption>(),
  );

  return [...grouped.values()];
}

function toFavoriteOptions(
  favorites: ReadonlyArray<string>,
  services: ReadonlyArray<StreamingSource>,
  countryCode: string,
): StreamingBrandOption[] {
  const bySlug = new Map(services.map((service) => [service.source, service]));
  const favoriteServices = favorites
    .map((favorite) => toFavoriteSlug(favorite, countryCode, bySlug))
    .filter((slug): slug is string => slug != null)
    .map((slug) => bySlug.get(slug))
    .filter((service): service is StreamingSource => service != null);

  return toBrandOptions(favoriteServices);
}

export function buildStreamingServiceOptions({
  countryCode,
  favorites,
  sourceMap,
}: BuildStreamingServiceOptionsParams): StreamingServiceOptions {
  const services = sourceMap.get(countryCode) ?? [];
  const favoriteOptions = toFavoriteOptions(favorites, services, countryCode);
  const fallbackOptions = toBrandOptions(services);

  return {
    all: sortStreamingServices(services).map(toServiceOption),
    top: (favoriteOptions.length > 0 ? favoriteOptions : fallbackOptions).slice(
      0,
      simpleServiceLimit,
    ),
    hasFavorites: favoriteOptions.length > 0,
  };
}
