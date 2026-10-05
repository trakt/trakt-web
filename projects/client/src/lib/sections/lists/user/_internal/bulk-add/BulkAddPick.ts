export type BulkAddPick = {
  key: string;
  type: 'movie' | 'show';
  id: number;
  sourceKey: string;
};
