export type PaginatedItemCount = {
  count: number;
  // True while more pages exist, so `count` only covers the loaded entries.
  isPartial: boolean;
};
