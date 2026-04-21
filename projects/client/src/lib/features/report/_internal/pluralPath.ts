import { ReportableType } from '../models/ReportableType.ts';

const PLURAL_PATH: Record<ReportableType, string> = {
  [ReportableType.Comment]: 'comments',
  [ReportableType.Movie]: 'movies',
  [ReportableType.Show]: 'shows',
  [ReportableType.Season]: 'seasons',
  [ReportableType.Episode]: 'episodes',
  [ReportableType.List]: 'lists',
  [ReportableType.User]: 'users',
};

export function pluralPath(type: ReportableType): string {
  return PLURAL_PATH[type];
}
