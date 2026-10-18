type HasReactionRoomParams = {
  count: number;
  limit?: number;
};

export function hasReactionRoom({
  count,
  limit,
}: HasReactionRoomParams): boolean {
  return limit == null || count < limit;
}
