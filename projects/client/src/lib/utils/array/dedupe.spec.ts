import { describe, expect, it } from 'vitest';
import { dedupe } from './dedupe.ts';

describe('dedupe', () => {
  it('should remove duplicates from a single array using string keys', () => {
    const items = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
      { id: 'a', value: 3 },
    ];

    const result = dedupe((item) => item.id, items);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: 'a', value: 3 },
      { id: 'b', value: 2 },
    ]);
  });

  it('should remove duplicates from a single array using number keys', () => {
    const items = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 1, name: 'third' },
    ];

    const result = dedupe((item) => item.id, items);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: 1, name: 'third' },
      { id: 2, name: 'second' },
    ]);
  });

  it('should merge multiple arrays and remove duplicates', () => {
    const array1 = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const array2 = [
      { id: 'b', value: 3 },
      { id: 'c', value: 4 },
    ];

    const result = dedupe((item) => item.id, array1, array2);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 3 },
      { id: 'c', value: 4 },
    ]);
  });

  it('should handle three or more arrays', () => {
    const array1 = [{ id: 1 }];
    const array2 = [{ id: 2 }];
    const array3 = [{ id: 1 }, { id: 3 }];

    const result = dedupe((item) => item.id, array1, array2, array3);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('should return empty array when no arrays provided', () => {
    const result = dedupe((item: { id: string }) => item.id);

    expect(result).toEqual([]);
  });

  it('should handle empty arrays', () => {
    const result = dedupe((item: { id: string }) => item.id, [], []);

    expect(result).toEqual([]);
  });

  it('should preserve the last occurrence of duplicate items', () => {
    const items = [
      { id: 'x', order: 1 },
      { id: 'x', order: 2 },
      { id: 'x', order: 3 },
    ];

    const result = dedupe((item) => item.id, items);

    expect(result).toHaveLength(1);
    expect(result.at(0)?.order).toBe(3);
  });

  it('should work with primitive values', () => {
    const items = ['apple', 'banana', 'apple', 'cherry'];

    const result = dedupe((item) => item, items);

    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should work with numbers', () => {
    const items = [1, 2, 3, 2, 4, 1];

    const result = dedupe((item) => item, items);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should handle complex keygen function', () => {
    const items = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
      { firstName: 'John', lastName: 'Doe' },
    ];

    const result = dedupe(
      (item) => `${item.firstName}-${item.lastName}`,
      items,
    );

    expect(result).toHaveLength(2);
  });

  it('should maintain insertion order across arrays', () => {
    const array1 = [{ id: 1 }, { id: 2 }];
    const array2 = [{ id: 3 }, { id: 4 }];

    const result = dedupe((item) => item.id, array1, array2);

    expect(result.map((item) => item.id)).toEqual([1, 2, 3, 4]);
  });

  it('should handle arrays with single item', () => {
    const items = [{ id: 'single' }];

    const result = dedupe((item) => item.id, items);

    expect(result).toEqual([{ id: 'single' }]);
  });

  it('should handle mixed types when keygen returns consistent keys', () => {
    const items = [
      { type: 'movie', id: 1 },
      { type: 'show', id: 1 },
      { type: 'movie', id: 1 },
    ];

    const result = dedupe((item) => `${item.type}-${item.id}`, items);

    expect(result).toHaveLength(2);
  });
});
