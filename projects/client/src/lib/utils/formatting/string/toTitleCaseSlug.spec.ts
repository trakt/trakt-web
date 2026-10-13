import { describe, expect, it } from 'vitest';
import { toTitleCaseSlug } from './toTitleCaseSlug.ts';

describe('util: toTitleCaseSlug', () => {
  it('should title case a slug', () => {
    expect(toTitleCaseSlug('studio-ghibli')).toBe('Studio Ghibli');
  });

  it('should treat underscores as spaces', () => {
    expect(toTitleCaseSlug('time_travel')).toBe('Time Travel');
  });
});
