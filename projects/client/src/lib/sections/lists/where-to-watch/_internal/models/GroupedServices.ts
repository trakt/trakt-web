import type { ServiceAvailability } from './ServiceAvailability.ts';
import type { StreamingGroup } from './StreamingGroup.ts';

export type GroupedServices = Record<
  StreamingGroup,
  ServiceAvailability[]
>;
