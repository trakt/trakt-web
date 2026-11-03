export function hasIndexedDb(): boolean {
  return Boolean(globalThis.indexedDB);
}
