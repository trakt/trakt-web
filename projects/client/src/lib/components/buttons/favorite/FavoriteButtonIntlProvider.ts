import * as m from '$lib/features/i18n/messages.ts';
import type {
  FavoriteButtonIntl,
  FavoriteButtonMeta,
} from './FavoriteButtonIntl.ts';

export const FavoriteButtonIntlProvider: FavoriteButtonIntl = {
  label: ({ title, isFavorited }: FavoriteButtonMeta) =>
    isFavorited
      ? m.remove_from_favorites_label({ title })
      : m.add_to_favorites_label({ title }),
  text: ({ isFavorited }: FavoriteButtonMeta) =>
    isFavorited ? m.remove_from_favorites() : m.add_to_favorites(),
  warning: ({ title }: FavoriteButtonMeta) =>
    m.remove_from_favorites_warning({ title }),
};
