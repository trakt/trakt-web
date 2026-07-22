type KeygenValue = string | number;
type KeygenFunc<T> = (item: T) => KeygenValue;

export function dedupe<T>(
  keygen: KeygenFunc<T>,
  ...sourceArrays: Array<T[]>
): T[] {
  const map = new Map<KeygenValue, T>();

  sourceArrays.forEach((arr) => {
    arr.forEach((item) => {
      const key = keygen(item);
      if (!map.has(key)) {
        map.set(key, item);
      }
    });
  });

  return Array.from(map.values());
}
