export type BulkAddItem = {
  key: string;
  type: 'movie' | 'show';
  id: number;
  title: string;
  year: number | Nil;
  posterUrl: string;
};
