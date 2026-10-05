export type BulkAddSource = {
  key: string;
  name: string;
  count?: number;
  request:
    | { type: 'watchlist' }
    | { type: 'list'; listId: string };
};
