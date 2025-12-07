export function iffy<T>(factory: () => T): T {
  return factory();
}
