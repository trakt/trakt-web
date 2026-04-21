import { describe, expect, it } from 'vitest';
import { ReportableType } from '../models/ReportableType.ts';
import { pluralPath } from './pluralPath.ts';

describe('pluralPath', () => {
  it.each(
    [
      [ReportableType.Comment, 'comments'],
      [ReportableType.Movie, 'movies'],
      [ReportableType.Show, 'shows'],
      [ReportableType.Season, 'seasons'],
      [ReportableType.Episode, 'episodes'],
      [ReportableType.List, 'lists'],
      [ReportableType.User, 'users'],
    ] as const,
  )('maps %s to /%s', (type, expected) => {
    expect(pluralPath(type)).toBe(expected);
  });
});
