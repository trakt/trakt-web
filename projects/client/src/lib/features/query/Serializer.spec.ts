import { describe, expect, it } from 'vitest';
import { Serializer } from './Serializer';

describe('Serializer', () => {
  it('should handle basic types', () => {
    const data = {
      string: 'test',
      number: 123,
      boolean: true,
      null: null,
      undefined,
    };
    const serialized = Serializer.encode(data);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(data);
  });

  it('should handle Map objects', () => {
    const map = new Map<unknown, unknown>([['key', 'value'], [
      1,
      2,
    ]]);
    const serialized = Serializer.encode(map);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(map);
  });

  it('should handle Set objects', () => {
    const set = new Set([1, 2, 'three']);
    const serialized = Serializer.encode(set);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(set);
  });

  it.only('should handle Date objects', () => {
    const obj = { date: new Date() };
    const serialized = Serializer.encode(obj);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(obj);
  });

  it('should handle BigInt values', () => {
    const data = { big: BigInt('9007199254740991') };
    const serialized = Serializer.encode(data);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(data);
  });

  it('should handle nested objects with _meta property', () => {
    const data = {
      _meta: { someData: 'test' },
      value: 123,
    };
    const serialized = Serializer.encode(data);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(data);
  });

  it('should call errorCallback for invalid meta types', () => {
    const invalidJson = '{"_meta":{"type":"invalid"},"value":123}';
    let error: Error | undefined;

    Serializer.decode(invalidJson, (err) => {
      error = err;
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('Unexpected meta type: invalid');
  });

  it('should handle complex nested structures', () => {
    const complex = {
      map: new Map([['key', new Set([1, 2, 3])]]),
      date: new Date(),
      nested: {
        _meta: { test: true },
        bigInt: BigInt('9007199254740991'),
      },
    };

    const serialized = Serializer.encode(complex);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(complex);
  });

  it('should handle deeply nested complex objects', () => {
    const deepComplex = {
      map1: new Map<unknown, unknown>([
        ['key1', new Set([new Date(), BigInt('123')])],
        ['key2', new Map([['nested', { value: true }]])],
      ]),
      set1: new Set([
        new Map([['test', 123]]),
        new Date(),
        { _meta: { special: 'value' } },
      ]),
      nested: {
        array: [new Set([1, 2]), new Map([['a', 'b']]), BigInt('456')],
        date: new Date(),
        map: new Map([['deep', new Set(['test'])]]),
      },
    };

    const serialized = Serializer.encode(deepComplex);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(deepComplex);
  });

  it('should handle nested Map and Set with various data types', () => {
    const nestedData = {
      outerMap: new Map<unknown, unknown>([
        [
          'mapKey',
          new Map<
            number | string,
            Set<string | number | Date> | { value: bigint }
          >([
            [123, new Set(['a', 1, new Date()])],
            ['nested', { value: BigInt('42') }],
          ]),
        ],
        [
          new Date(),
          new Set([
            new Map([['inner', true]]),
            BigInt('789'),
          ]),
        ],
      ]),
      outerSet: new Set([
        new Map<unknown, unknown>([
          ['setKey', { _meta: { type: 'custom' } }],
          [42, new Set([1, 2, 3])],
        ]),
        new Date(),
        BigInt('999'),
      ]),
    };

    const serialized = Serializer.encode(nestedData);
    const deserialized = Serializer.decode(serialized);
    expect(deserialized).toEqual(nestedData);
  });
});
