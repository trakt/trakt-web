export type ListDropdownItemMeta = {
  isListed: boolean;
  title: string;
  listName: string;
};

export type ListDropdownItemIntl = {
  label: (meta: ListDropdownItemMeta) => string;
  text: (meta: ListDropdownItemMeta) => string;
};
