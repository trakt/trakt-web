export function fromLegacyReelSeen(legacy: unknown): unknown {
  if (!Array.isArray(legacy)) return null;

  return Object.fromEntries(
    legacy.filter(Number.isInteger).map((year) => [String(year), true]),
  );
}
