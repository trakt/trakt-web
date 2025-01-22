export type FavoriteButtonMeta = {
  isFavorited: boolean;
  title: string;
};

export type FavoriteButtonIntl = {
  label: (meta: FavoriteButtonMeta) => string;
  text: (meta: FavoriteButtonMeta) => string;
  warning: (meta: FavoriteButtonMeta) => string;
};
