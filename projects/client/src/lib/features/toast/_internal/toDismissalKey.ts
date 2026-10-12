export function toDismissalKey(
  { id, type }: { id: number | string; type: string },
): string {
  return `${type}:${id}`;
}
