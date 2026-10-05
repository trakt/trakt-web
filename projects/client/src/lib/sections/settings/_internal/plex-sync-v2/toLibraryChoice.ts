export function toLibraryChoice(
  libraryIds: string[],
  externalId: string,
  enabled: boolean,
): string[] {
  const others = libraryIds.filter((id) => id !== externalId);
  return enabled ? [...others, externalId] : others;
}
