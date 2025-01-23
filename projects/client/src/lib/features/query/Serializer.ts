interface MetaValue<T extends string, V> {
  _meta: {
    type: T;
    value?: V;
  };
  value: string;
}

type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | bigint
  | Map<unknown, unknown>
  | Set<unknown>
  | Record<string, unknown>
  | SerializableValue[];

const META_KEY = '_meta';

function replacer(key: string, value: unknown): SerializableValue {
  if (value === null) {
    return value;
  }

  // Handle primitive types and BigInt
  if (typeof value !== 'object') {
    if (typeof value === 'bigint') {
      return {
        [META_KEY]: { type: 'bigint' },
        value: value.toString(),
      };
    }

    return value as SerializableValue;
  }

  // Handle Date
  if (value instanceof Date) {
    return {
      [META_KEY]: { type: 'date' },
      value: value.toISOString(),
    };
  }

  // Handle Map
  if (value instanceof Map) {
    return {
      [META_KEY]: { type: 'map' },
      value: Array.from(value.entries()).map(([k, v]) => [
        replacer('key', k),
        replacer('value', v),
      ]),
    };
  }

  // Handle Set
  if (value instanceof Set) {
    return {
      [META_KEY]: { type: 'set' },
      value: Array.from(value.values()).map((v) => replacer('value', v)),
    };
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => replacer('', item));
  }

  // Handle objects with meta key
  if (
    typeof value === 'object' &&
    value !== null &&
    META_KEY in value
  ) {
    const obj = value as Record<string, unknown>;
    return {
      ...obj,
      [META_KEY]: {
        type: 'escaped-meta',
        value: obj[META_KEY],
      },
    };
  }

  // Handle regular objects
  const result: Record<string, SerializableValue> = {};
  const obj = value as Record<string, unknown>;
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result[prop] = replacer(prop, obj[prop]);
    }
  }
  return result;
}

function reviver(
  _key: string,
  value: unknown,
  errorCallback?: (error: Error) => void,
): SerializableValue {
  if (typeof value !== 'object' || value === null) {
    return value as SerializableValue;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => reviver('', item, errorCallback));
  }

  const obj = value as Record<string, unknown>;
  if (META_KEY in obj) {
    const meta = obj[META_KEY] as {
      type: string;
      value?: unknown;
    };

    switch (meta.type) {
      case 'date':
        return new Date(obj.value as string);
      case 'bigint':
        return BigInt(obj.value as string);
      case 'map':
        return new Map(
          (obj.value as [unknown, unknown][]).map(([k, v]) => [
            reviver('key', k, errorCallback),
            reviver('value', v, errorCallback),
          ]),
        );
      case 'set':
        return new Set(
          (obj.value as unknown[]).map((v) =>
            reviver('value', v, errorCallback)
          ),
        );
      case 'escaped-meta':
        return {
          ...obj,
          [META_KEY]: meta.value,
        };
      default:
        errorCallback?.(
          new Error(`Unexpected meta type: ${meta.type}`, {
            cause: meta,
          }),
        );
        return null;
    }
  }

  // Handle regular objects
  const result: Record<string, SerializableValue> = {};
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result[prop] = reviver(prop, obj[prop], errorCallback);
    }
  }
  return result;
}

export const Serializer = {
  encode<T>(value: T): string {
    return JSON.stringify(
      value,
      (key, value) => replacer(key, value),
    );
  },

  decode<T>(
    text: string,
    errorCallback?: (error: Error) => void,
  ): T {
    return JSON.parse(
      text,
      (key, value) => reviver(key, value, errorCallback),
    ) as T;
  },
};
