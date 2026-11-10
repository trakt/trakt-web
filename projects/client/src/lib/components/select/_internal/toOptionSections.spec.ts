import { describe, expect, it } from 'vitest';
import { toOptionSections } from './toOptionSections.ts';

const oscars = { key: 'oscars', label: 'Oscars' };
const emmys = { key: 'emmys', label: 'Emmys' };

describe('util: toOptionSections', () => {
  it('should gather consecutive options of a group under one section', () => {
    const sections = toOptionSections([
      { value: 'picture', label: 'Best Picture', group: oscars },
      { value: 'director', label: 'Best Director', group: oscars },
      { value: 'drama', label: 'Outstanding Drama Series', group: emmys },
    ]);

    expect(
      sections.map(({ key, label, options }) => ({
        key,
        label,
        values: options.map((option) => option.value),
      })),
    ).toEqual([
      { key: 'group:oscars', label: 'Oscars', values: ['picture', 'director'] },
      { key: 'group:emmys', label: 'Emmys', values: ['drama'] },
    ]);
  });

  it('should keep ungrouped options as their own sections', () => {
    const sections = toOptionSections([
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
    ]);

    expect(sections.map(({ key, label }) => ({ key, label }))).toEqual([
      { key: 'option:en', label: undefined },
      { key: 'option:fr', label: undefined },
    ]);
  });
});
