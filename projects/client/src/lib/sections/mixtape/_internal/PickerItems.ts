export type PickerItems<T> = {
  kind: 'recent' | 'fits' | 'search';
  items: Array<{ media: T; isOff: boolean }>;
};
