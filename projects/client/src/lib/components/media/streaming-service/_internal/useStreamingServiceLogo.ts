import { useQuery } from '$lib/features/query/useQuery.ts';
import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map, Observable, of } from 'rxjs';

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
    name: source.name,
    url: source.logoUrl,
    channelUrl: source.channelLogoUrl,
  };
}

export function useStreamingServiceLogo(
  { source, country }: UseStreamingServicesProps,
): Observable<ServiceLogo | undefined> {
  const { country: userCountry } = useStreamingPreferences();
  const query = useQuery(streamingSourcesQuery({}));

  const activeCountry = country ? of(country) : userCountry;

  return combineLatest([
    activeCountry,
    query,
  ]).pipe(
    map(([countryCode, $query]) => {
      if (!$query.data) {
        return undefined;
      }

      const services = $query.data.get(countryCode) ?? [];
      const service = services.find((s) => s.source === source);

      if (service) {
        return service ? mapToLogo(service) : undefined;
      }

      const allServices = Array.from($query.data.values() ?? []).flat();
      const fallbackService = allServices.find((s) => s.source === source);
      return fallbackService ? mapToLogo(fallbackService) : undefined;
    }),
  );
}
