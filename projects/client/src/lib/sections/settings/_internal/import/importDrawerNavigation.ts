import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum ImportDrawers {
  JsonGuidelines = 'json-guidelines',
  CsvGuidelines = 'csv-guidelines',
}

function mapToDrawer(value: string | Nil): ImportDrawers | null {
  switch (value) {
    case ImportDrawers.JsonGuidelines:
      return ImportDrawers.JsonGuidelines;
    case ImportDrawers.CsvGuidelines:
      return ImportDrawers.CsvGuidelines;
    default:
      return null;
  }
}

export function importDrawerNavigation(searchParams?: URLSearchParams) {
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));

  return { drawer, ...drawerNavigation<ImportDrawers>() };
}
