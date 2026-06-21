import { getWellKnownSourceGroup } from '$lib/components/media/streaming-service/getWellKnownSourceGroup.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { sortStreamingServices } from '$lib/requests/_internal/sortStreamingServices.ts';
import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { STREAMING_BRANDS } from './streamingBrands.ts';

export type StreamingServiceOption = {
  source: string;
  name: string;
};

export type StreamingBrandOption = {
  key: string;
  name: string;
  source: string;
  color: string | undefined;
  slugs: string[];
};

type StreamingServiceOptions = {
  all: StreamingServiceOption[];
  top: StreamingBrandOption[];
};

function toOption(source: StreamingSource): StreamingServiceOption {
  return { source: source.source, name: source.name };
}

function toBrandOptions(
  services: ReadonlyArray<StreamingSource>,
): StreamingBrandOption[] {
  const bySlug = new Map(services.map((service) => [service.source, service]));

  return STREAMING_BRANDS.flatMap((brand) => {
    const slugs = brand.slugs.filter((slug) => bySlug.has(slug));
    const representative = slugs.at(0);

    if (representative == null) {
      return [];
    }

    return [{
      key: brand.key,
      name: bySlug.get(representative)?.name ?? brand.key,
      source: representative,
      color: bySlug.get(representative)?.color ?? undefined,
      slugs,
    }];
  });
}

function toFavoriteSlug(favorite: string): string {
  return favorite.split('-').slice(1).join('-');
}

function toBrandKey(slug: string): string {
  return getWellKnownSourceGroup(slug) ??
    STREAMING_BRANDS.find((brand) => brand.slugs.includes(slug))?.key ??
    slug;
}

function toFavoriteOptions(
  favorites: ReadonlyArray<string>,
  services: ReadonlyArray<StreamingSource>,
): StreamingBrandOption[] {
  const bySlug = new Map(services.map((service) => [service.source, service]));

  const groups = favorites
    .map(toFavoriteSlug)
    .filter((slug) => bySlug.has(slug))
    .reduce((acc, slug) => {
      const key = toBrandKey(slug);
      const slugs = acc.get(key) ?? [];

      if (!slugs.includes(slug)) {
        acc.set(key, [...slugs, slug]);
      }

      return acc;
    }, new Map<string, string[]>());

  return [...groups].flatMap(([key, slugs]) => {
    const ranked = sortStreamingServices(
      slugs
        .map((slug) => bySlug.get(slug))
        .filter((service): service is StreamingSource => service != null),
    );
    const representative = ranked.at(0);

    if (representative == null) {
      return [];
    }

    return [{
      key,
      name: representative.name,
      source: representative.source,
      color: representative.color ?? undefined,
      slugs,
    }];
  });
}

export function useStreamingServiceOptions(): Observable<
  StreamingServiceOptions
> {
  const { country, favorites } = useStreamingPreferences();
  const query = useQuery(streamingSourcesQuery({}));

  return combineLatest([country, favorites, query]).pipe(
    map(([countryCode, $favorites, $query]) => {
      const services = $query.data?.get(countryCode) ?? [];
      const favoriteOptions = toFavoriteOptions($favorites, services);

      return {
        all: sortStreamingServices(services).map(toOption),
        top: favoriteOptions.length > 0
          ? favoriteOptions
          : toBrandOptions(services),
      };
    }),
  );
}
