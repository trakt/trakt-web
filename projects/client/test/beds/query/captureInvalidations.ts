const MARKER_PREFIX = 'trakt-marker:';

function markerKeys(): string[] {
  const storage = globalThis.localStorage;

  return Array.from(
    { length: storage.length },
    (_, index) => storage.key(index),
  )
    .filter((key): key is string => key?.startsWith(MARKER_PREFIX) ?? false);
}

// Two runs inside the same millisecond stamp the same marker value, so the
// bed clears first and reports presence rather than diffing timestamps.
export async function captureInvalidations(
  run: () => Promise<unknown>,
): Promise<string[]> {
  markerKeys().forEach((key) => globalThis.localStorage.removeItem(key));

  await run();

  return markerKeys().map((key) => key.slice(MARKER_PREFIX.length));
}
