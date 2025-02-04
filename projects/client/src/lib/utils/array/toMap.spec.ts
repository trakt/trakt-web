import { describe, expect, it } from 'vitest';
import { toMap } from './toMap.ts';

describe('toMap', () => {
  it('should convert array to map using mapping function', () => {
    const input = [1, 2, 3];
    const result = toMap(
      input,
      (n) => ({ id: n, value: n * 2 }),
      (item) => item.id,
    );

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(3);
    expect(result.get(1)).toEqual({ id: 1, value: 2 });
    expect(result.get(2)).toEqual({ id: 2, value: 4 });
    expect(result.get(3)).toEqual({ id: 3, value: 6 });
  });

  it('should handle empty array', () => {
    const result = toMap(
      [],
      (n) => n,
      (n) => n,
    );

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('should handle complex objects', () => {
    const input = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    const result = toMap(
      input,
      (person) => ({ ...person, id: person.name.toLowerCase() }),
      (person) => person.id,
    );

    expect(result.size).toBe(2);
    expect(result.get('john')).toEqual({ name: 'John', age: 30, id: 'john' });
    expect(result.get('jane')).toEqual({ name: 'Jane', age: 25, id: 'jane' });
  });
});
