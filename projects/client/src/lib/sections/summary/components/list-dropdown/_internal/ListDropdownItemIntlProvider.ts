import * as m from '$lib/features/i18n/messages.ts';
import type {
  ListDropdownItemIntl,
  ListDropdownItemMeta,
} from './ListDropdownItemIntl.ts';

export const ListDropdownItemIntlProvider: ListDropdownItemIntl = {
  label: ({ title, isListed, listName }: ListDropdownItemMeta) =>
    isListed
      ? m.remove_from_personal_list_label({ list: listName, title })
      : m.add_to_personal_list_label({ list: listName, title }),
  text: ({ listName }: ListDropdownItemMeta) => listName,
};
