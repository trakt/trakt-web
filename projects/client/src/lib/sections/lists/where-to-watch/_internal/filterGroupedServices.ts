import type { GroupedServices } from './models/GroupedServices.ts';
import type { ServiceAvailability } from './models/ServiceAvailability.ts';

type FilterGroupedServicesProps = {
  readonly grouped: GroupedServices;
  readonly term: string;
  readonly names: ReadonlyMap<string, string>;
};

type FilterRowProps = {
  readonly row: ServiceAvailability;
  readonly term: string;
  readonly names: ReadonlyMap<string, string>;
};

function filterRow(
  { row, term, names }: FilterRowProps,
): ServiceAvailability | null {
  const serviceName = names.get(row.source) ?? row.source;
  const serviceMatches = serviceName.toLocaleLowerCase().includes(term) ||
    row.source.toLocaleLowerCase().includes(term);

  if (serviceMatches) {
    return row;
  }

  const countries = row.countries.filter((entry) =>
    entry.countryName.toLocaleLowerCase().includes(term)
  );

  if (countries.length === 0) {
    return null;
  }

  return { ...row, countries };
}

export function filterGroupedServices(
  { grouped, term, names }: FilterGroupedServicesProps,
): GroupedServices {
  return Object.fromEntries(
    Object.entries(grouped).map(([group, rows]) => [
      group,
      rows
        .map((row) => filterRow({ row, term, names }))
        .filter((row): row is ServiceAvailability => row !== null),
    ]),
  ) as GroupedServices;
}
