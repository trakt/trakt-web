export type ReorderableListItem = {
  key: string;
  listItemId: number;
  rank: number;
  title: string;
  subtitle?: string;
  posterUrl?: HttpsUrl;
};
