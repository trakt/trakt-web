import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import type { QueryClient } from '@tanstack/query-core';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import { cleanStreamingServiceName } from './_internal/cleanStreamingServiceName.ts';

type UseStreamingServicesProps = {
  source: string;
  country?: string;
};

type ServiceLogo = {
  name: string;
  url: HttpsUrl | Nil;
  channelUrl: HttpsUrl | Nil;
};

function mapToLogo(source: StreamingSource): ServiceLogo {
  return {
    name: cleanStreamingServiceName(source.name),
    url: source.logoUrl,
    channelUrl: source.channelLogoUrl,
  };
}

type SourceLookup = {
  byCountry: ReadonlyMap<string, ReadonlyMap<string, StreamingSource>>;
  anyCountry: ReadonlyMap<string, StreamingSource>;
};

function indexBySource(services: StreamingSource[]) {
  const index = new Map<string, StreamingSource>();
  services.forEach((service) => {
    if (!index.has(service.source)) index.set(service.source, service);
  });
  return index;
}

function toSourceLookup(
  data: ReadonlyMap<string, StreamingSource[]>,
): SourceLookup {
  return {
    byCountry: new Map(
      Array.from(data, ([code, services]) => [code, indexBySource(services)]),
    ),
    anyCountry: indexBySource(Array.from(data.values()).flat()),
  };
}

const lookupByClient = new WeakMap<
  QueryClient,
  Observable<SourceLookup | undefined>
>();

function useSourceLookup(): Observable<SourceLookup | undefined> {
  const client = useQueryClient();
  const existing = lookupByClient.get(client);
  if (existing) return existing;

  const lookup = useQuery(streamingSourcesQuery({})).pipe(
    map(($query) => $query.data),
    distinctUntilChanged(),
    map((data) => (data ? toSourceLookup(data) : undefined)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  lookupByClient.set(client, lookup);
  return lookup;
}

export function useStreamingServiceLogo({
  source,
  country,
}: UseStreamingServicesProps): Observable<ServiceLogo | undefined> {
  const { country: userCountry } = useStreamingPreferences();
  const lookup = useSourceLookup();

  const activeCountry = country ? of(country) : userCountry;

  return combineLatest([activeCountry, lookup]).pipe(
    map(([countryCode, $lookup]) => {
      if (!$lookup) {
        return undefined;
      }

      const service =
        $lookup.byCountry.get(countryCode)?.get(source) ??
        $lookup.anyCountry.get(source);

      return service ? mapToLogo(service) : undefined;
    }),
  );
}
