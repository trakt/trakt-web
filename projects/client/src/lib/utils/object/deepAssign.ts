type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : Partial<T[P]>;
};

export function deepAssign<T extends object>(
  target: T,
  source: DeepPartial<T>,
): T {
  const result = { ...target };

  for (const key in source) {
    if (!(key in target)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = target[key];

    if (sourceValue === undefined) {
      continue;
    }

    if (
      !sourceValue ||
      !targetValue ||
      typeof sourceValue !== 'object' ||
      typeof targetValue !== 'object'
    ) {
      result[key] = sourceValue as T[typeof key];
      continue;
    }

    if (Array.isArray(targetValue)) {
      result[key] = Array.isArray(sourceValue)
        ? [...sourceValue] as T[typeof key]
        : [...targetValue] as T[typeof key];
      continue;
    }

    if (targetValue instanceof Set) {
      result[key] = sourceValue instanceof Set
        ? new Set(sourceValue) as T[typeof key]
        : new Set(targetValue) as T[typeof key];
      continue;
    }

    if (targetValue instanceof Map) {
      result[key] = sourceValue instanceof Map
        ? new Map(sourceValue) as T[typeof key]
        : new Map(targetValue) as T[typeof key];
      continue;
    }

    result[key] = deepAssign(
      targetValue,
      sourceValue as DeepPartial<typeof targetValue>,
    );
  }

  return result;
}
