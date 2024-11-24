export type PageMeta = {
  current: number;
  total: number;
};

export type Paginatable<T> = {
  entries: T[];
  page: PageMeta;
};
