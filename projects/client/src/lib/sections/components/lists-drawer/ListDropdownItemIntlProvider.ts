import * as m from '$lib/features/i18n/messages.ts';
import type {
  ListDropdownItemIntl,
  ListDropdownItemMeta,
} from './ListDropdownItemIntl.ts';

export const ListDropdownItemIntlProvider: ListDropdownItemIntl = {
  label: ({ title, isListed, listName }: ListDropdownItemMeta) =>
    isListed
      ? m.button_label_remove_from_personal_list({ list: listName, title })
      : m.button_label_add_to_personal_list({ list: listName, title }),
  text: ({ listName }: ListDropdownItemMeta) => listName,
  viewLabel: ({ listName }: ListDropdownItemMeta) =>
    m.link_label_view_list({ name: listName }),
  viewTooltip: () => m.tooltip_view_list(),
};
