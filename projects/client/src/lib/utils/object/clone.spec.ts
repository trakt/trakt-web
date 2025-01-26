import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone', () => {
  it('should create a deep copy of an object', () => {
    const original = {
      name: 'test',
      nested: {
        value: 123,
      },
      array: [1, 2, 3],
    };

    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(original.nested);
    expect(cloned.array).not.toBe(original.array);
  });

  it('should handle empty objects', () => {
    const original = {};
    const cloned = clone(original);

    expect(cloned).toEqual({});
    expect(cloned).not.toBe(original);
  });

  it('should clone objects with dates', () => {
    const original = {
      date: new Date('2023-01-01'),
      nested: {
        date: new Date('2023-12-31'),
      },
    };
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned.date).not.toBe(original.date);
    expect(cloned.nested.date).not.toBe(original.nested.date);
  });

  it('should clone complex nested structures', () => {
    const original = {
      array: [
        { id: 1, items: [1, 2, 3] },
        { id: 2, items: [4, 5, 6] },
      ],
      nested: {
        deep: {
          deeper: {
            value: 'test',
            numbers: [1, 2, 3],
          },
        },
      },
      mix: [
        { a: 1 },
        [{ b: 2 }],
        3,
      ],
    };
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned.array[0]).not.toBe(original.array[0]);
    expect(cloned.nested.deep.deeper).not.toBe(original.nested.deep.deeper);
    expect((cloned.mix[1] as { b: number }[])[0]).not.toBe(
      (original.mix[1] as { b: number }[])[0],
    );
  });

  it('should not handle circular references', () => {
    const original = { a: 1, self: null as unknown };
    original.self = original;

    expect(() => clone(original)).toThrow();
  });

  it('should clone complex objects with Sets, Maps, and BigInts', () => {
    const original = {
      set: new Set([1, 2, 3]),
      map: new Map([['a', 1], ['b', 2]]),
      bigInt: BigInt('9007199254740991'),
      nested: {
        set: new Set(['x', 'y']),
        map: new Map([['c', { value: 3 }]]),
      },
    };
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned.set).not.toBe(original.set);
    expect(cloned.map).not.toBe(original.map);
    expect(cloned.bigInt).toBe(original.bigInt);
    expect(cloned.nested.set).not.toBe(original.nested.set);
    expect(cloned.nested.map).not.toBe(original.nested.map);
  });
});
