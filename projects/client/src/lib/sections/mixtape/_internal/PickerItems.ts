export type PickerItem<T> = {
  media: T;
  isOff: boolean;
  slot: number | null;
};

export type PickerItems<T> = {
  kind: 'recent' | 'fits' | 'search';
  items: Array<PickerItem<T>>;
};
