import { describe, expect, it } from 'vitest';
import { toAwardCategoryName } from './toAwardCategoryName.ts';

describe('util: toAwardCategoryName', () => {
  it('should strip the ceremony prefix', () => {
    expect(toAwardCategoryName('Academy Award for Best Actor')).toBe(
      'Best Actor',
    );
    expect(toAwardCategoryName('Golden Globe Award for Best Director')).toBe(
      'Best Director',
    );
    expect(
      toAwardCategoryName('Primetime Emmy Award for Outstanding Drama Series'),
    ).toBe('Outstanding Drama Series');
  });

  it('should keep names without a prefix', () => {
    expect(toAwardCategoryName('Best Picture')).toBe('Best Picture');
    expect(toAwardCategoryName('Golden Lion')).toBe('Golden Lion');
  });
});
