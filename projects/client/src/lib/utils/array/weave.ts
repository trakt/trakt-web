export function weave<T>(...arrays: T[][]): T[] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));

  return Array
    .from(
      { length: maxLength },
      (_, i) =>
        arrays
          .filter((array) => array.length > i)
          .map((array) => array.at(i) as T),
    )
    .flat();
}
