import { goto } from '$app/navigation';
import { page } from '$app/state';

const VIEW_PARAM = 'view';

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
  const drawer = mapToDrawer(searchParams?.get(VIEW_PARAM));

  const buildDrawerLink = (drawer: ImportDrawers) => {
    const url = new URL(page.url);
    url.searchParams.set(VIEW_PARAM, drawer);
    return url.toString();
  };

  const close = () => {
    const url = new URL(page.url);
    url.searchParams.delete(VIEW_PARAM);
    goto(url, { noScroll: true });
  };

  return { drawer, buildDrawerLink, close };
}
