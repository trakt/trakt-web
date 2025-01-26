export function clone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'bigint') {
      return obj;
    }
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj) as T;
  }

  if (obj instanceof Set) {
    return new Set([...obj]) as T;
  }

  if (obj instanceof Map) {
    return new Map([...obj]) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => clone(item)) as T;
  }

  const result = {} as { [K in keyof T]: T[K] };
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = clone(obj[key]) as T[Extract<keyof T, string>];
    }
  }

  return result;
}
