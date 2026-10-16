import type { SmartListTemplate } from '$lib/requests/models/SmartListTemplate.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { describe, expect, it } from 'vitest';
import { getVisibleSmartListTemplates } from './getVisibleSmartListTemplates.ts';

const template = (
  overrides: Partial<SmartListTemplate>,
): SmartListTemplate => ({
  key: 'smart-list-template-hidden-gems',
  id: 'hidden-gems',
  source: 'discover',
  mediaType: 'movies',
  filters: { ratings: [78] },
  personal: false,
  total: 10,
  posters: [],
  ...overrides,
});

const list = (overrides: Partial<SmartList>): SmartList => ({
  key: 'smart-list-mine',
  title: 'Mine',
  slug: 'mine',
  id: 1,
  source: 'discover',
  mediaType: 'movies',
  privacy: 'private',
  filters: {},
  posters: [],
  updatedAt: new Date(0),
  ...overrides,
});

describe('util: getVisibleSmartListTemplates', () => {
  it('should show every known template to a user without lists', () => {
    const templates = [template({}), template({ id: 'whodunits' })];

    expect(
      getVisibleSmartListTemplates({ templates, lists: [], mode: 'media' }),
    )
      .toEqual(templates);
  });

  it('should show templates while the user has fewer than three lists', () => {
    const lists = [list({ slug: 'a' }), list({ slug: 'b' })];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toHaveLength(1);
  });

  it('should hide every template at three lists', () => {
    const lists = [
      list({ slug: 'a' }),
      list({ slug: 'b' }),
      list({ slug: 'c' }),
    ];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toEqual([]);
  });

  it('should hide a template the user already has', () => {
    const lists = [list({ filters: { ratings: [78] } })];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toEqual([]);
  });

  it('should hide a template saved with its open ranges closed', () => {
    const lists = [list({ filters: { ratings: [78, 100] } })];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toEqual([]);
  });

  it('should keep a template whose filters were changed', () => {
    const lists = [list({ filters: { ratings: [80] } })];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toHaveLength(1);
  });

  it('should keep a template with another source or media type', () => {
    const lists = [
      list({ source: 'trending', filters: { ratings: [78] } }),
      list({ mediaType: 'shows', filters: { ratings: [78] } }),
    ];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'media',
      }),
    ).toHaveLength(1);
  });

  it('should skip a template the client has no copy for', () => {
    expect(
      getVisibleSmartListTemplates({
        templates: [template({ id: 'from-the-future' })],
        lists: [],
        mode: 'media',
      }),
    ).toEqual([]);
  });

  it('should only show templates for the selected mode', () => {
    const templates = [
      template({ id: 'hidden-gems', mediaType: 'movies' }),
      template({ id: 'whodunits', mediaType: 'shows' }),
      template({ id: 'time-twisters', mediaType: 'media' }),
    ];

    expect(
      getVisibleSmartListTemplates({ templates, lists: [], mode: 'show' })
        .map(({ id }) => id),
    ).toEqual(['whodunits', 'time-twisters']);
  });

  it('should count lists of every mode towards the cap', () => {
    const lists = [
      list({ slug: 'a', mediaType: 'shows' }),
      list({ slug: 'b', mediaType: 'shows' }),
      list({ slug: 'c', mediaType: 'shows' }),
    ];

    expect(
      getVisibleSmartListTemplates({
        templates: [template({})],
        lists,
        mode: 'movie',
      }),
    ).toEqual([]);
  });
});
