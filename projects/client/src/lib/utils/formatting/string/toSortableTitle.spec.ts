import { describe, expect, it } from 'vitest';
import { toSortableTitle } from './toSortableTitle.ts';

describe('util: toSortableTitle', () => {
  it('should strip a leading "The"', () => {
    expect(toSortableTitle('The Matrix')).toBe('Matrix');
  });

  it('should strip a leading "A"', () => {
    expect(toSortableTitle('A Clockwork Orange')).toBe('Clockwork Orange');
  });

  it('should strip a leading "An"', () => {
    expect(toSortableTitle('An Animal')).toBe('Animal');
  });

  it('should be case-insensitive', () => {
    expect(toSortableTitle('the boys')).toBe('boys');
  });

  it('should not strip an article that is not followed by whitespace', () => {
    expect(toSortableTitle('Andromeda')).toBe('Andromeda');
    expect(toSortableTitle('Theory')).toBe('Theory');
  });

  it('should leave a title that is literally an article untouched', () => {
    expect(toSortableTitle('The')).toBe('The');
  });

  it('should only strip the first leading article', () => {
    expect(toSortableTitle('The A Team')).toBe('A Team');
  });

  it('should leave a title with no leading article untouched', () => {
    expect(toSortableTitle('Breaking Bad')).toBe('Breaking Bad');
  });
});
