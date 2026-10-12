export function fromLegacyNudgeDismissals(
  legacy: unknown,
  userId: string | number,
): Record<string, unknown> | null {
  if (!legacy || typeof legacy !== 'object') return null;

  const prefix = `${userId}/`;

  return Object.fromEntries(
    Object.entries(legacy)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, record]) => [key.slice(prefix.length), record]),
  );
}
