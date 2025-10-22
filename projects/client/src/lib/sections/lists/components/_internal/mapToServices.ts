import type { StreamOn } from '$lib/requests/models/StreamOn.ts';

export function mapToServices(streamOn?: StreamOn) {
  if (!streamOn?.services) {
    return [];
  }

  const { services, preferred } = streamOn;

  const nonPreferred = services.streaming
    .filter((service) => service.source !== preferred?.source);

  const allServices = [
    ...(preferred ? [preferred] : []),
    ...nonPreferred,
    ...services.onDemand,
  ];

  return allServices.map(
    (service) => ({
      ...service,
      id: `${service.type}-${service.source}`,
    }),
  );
}
