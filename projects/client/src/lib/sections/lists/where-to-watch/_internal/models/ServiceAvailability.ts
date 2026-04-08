import type { ServiceInCountry } from './ServiceInCountry.ts';

export type ServiceAvailability = {
  readonly key: string;
  readonly source: string;
  readonly countries: ServiceInCountry[];
};
