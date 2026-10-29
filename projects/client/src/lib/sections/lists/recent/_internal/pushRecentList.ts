export const MAX_STORED_RECENT_LISTS = 8;

export function pushRecentList(
  listIds: ReadonlyArray<number>,
  listId: number,
): number[] {
  const others = listIds.filter((id) => id !== listId);

  return [listId, ...others].slice(0, MAX_STORED_RECENT_LISTS);
}
