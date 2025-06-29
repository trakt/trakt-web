import * as m from '$lib/features/i18n/messages.ts';
import type {
  FavoriteButtonIntl,
  FavoriteButtonMeta,
} from './FavoriteButtonIntl.ts';

export const FavoriteButtonIntlProvider: FavoriteButtonIntl = {
  label: ({ title, isFavorited }: FavoriteButtonMeta) =>
    isFavorited
      ? m.button_label_remove_from_favorites({ title })
      : m.button_label_add_to_favorites({ title }),
  text: ({ isFavorited }: FavoriteButtonMeta) =>
    isFavorited
      ? m.button_text_remove_from_favorites()
      : m.button_text_add_to_favorites(),
};
