import { describe, expect, it } from 'vitest';
import { deepAssign } from './deepAssign';

describe('deepAssign', () => {
  it('should merge shallow properties', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3 };

    expect(deepAssign(target, source)).toEqual({ a: 1, b: 3 });
  });

  it('should ignore undefined values', () => {
    const target = { a: 1, b: 2 };
    const source = { b: undefined };

    expect(deepAssign(target, source)).toEqual({ a: 1, b: 2 });
  });

  it('should merge nested objects', () => {
    const target = { a: { x: 1, y: 2 }, b: 3 };
    const source = { a: { y: 4 } };

    expect(deepAssign(target, source)).toEqual({ a: { x: 1, y: 4 }, b: 3 });
  });

  it('should ignore properties not present in target', () => {
    const target = { a: 1 };
    const source = { a: 2, b: 3 } as unknown as Partial<typeof target>;

    expect(deepAssign(target, source)).toEqual({ a: 2 });
  });

  it('should handle deep nested objects', () => {
    const target = {
      a: {
        b: {
          c: 1,
          d: 2,
        },
      },
    };
    const source = {
      a: {
        b: {
          d: 3,
        },
      },
    };

    expect(deepAssign(target, source)).toEqual({
      a: {
        b: {
          c: 1,
          d: 3,
        },
      },
    });
  });

  it('should handle complex nested types', () => {
    const date = new Date();
    const map = new Map([[1, 'one']]);
    const set = new Set([1, 2, 3]);

    const target = {
      dates: { created: date, updated: null },
      collections: {
        map,
        set,
        array: [1, 2, { nested: 'value' }],
      },
      deep: {
        level1: {
          level2: {
            mixed: [{ a: 1 }, set, map],
          },
        },
      },
    };

    const source = {
      dates: { updated: date },
      collections: {
        map: new Map([[2, 'two']]),
        set: new Set([4]),
        array: [3, 4, { nested: 'new' }],
      },
      deep: {
        level1: {
          level2: {
            mixed: [{ a: 2 }, new Set([5]), new Map([[3, 'three']])],
          },
        },
      },
    };

    expect(deepAssign(target, source as unknown as Partial<typeof target>))
      .toEqual({
        dates: { created: date, updated: date },
        collections: {
          map: new Map([[2, 'two']]),
          set: new Set([4]),
          array: [3, 4, { nested: 'new' }],
        },
        deep: {
          level1: {
            level2: {
              mixed: [{ a: 2 }, new Set([5]), new Map([[3, 'three']])],
            },
          },
        },
      });
  });
});
