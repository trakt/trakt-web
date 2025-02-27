import { describe, expect, it } from 'vitest';
import { pluralize } from './pluralize.ts';

describe('pluralize', () => {
  it('should return a non pluralized translation', () => {
    expect(pluralize('test_counted_item', 1)).toBe('1 item');
  });

  it('should return a pluralized translation', () => {
    expect(pluralize('test_counted_item', 2)).toBe('2 items');
  });

  it('should return the key if there is no non pluralized translation', () => {
    expect(pluralize('test_not_translated', 1)).toBe(
      'single_test_not_translated',
    );
  });

  it('should return the key if there is no pluralized translation', () => {
    expect(pluralize('test_not_translated', 2)).toBe(
      'test_not_translated',
    );
  });
});
