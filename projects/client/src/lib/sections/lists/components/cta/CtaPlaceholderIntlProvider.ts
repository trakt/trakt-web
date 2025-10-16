import * as m from '$lib/features/i18n/messages.ts';
import type { CtaItemIntl, CtaItemMeta, CtaLinkMeta } from './CtaItemIntl.ts';
import { CtaItemIntlProvider } from './CtaItemIntlProvider.ts';

export const CtaPlaceholderIntlProvider: CtaItemIntl = {
  text: ({ cta }: CtaItemMeta) => {
    switch (cta.type) {
      case 'activity':
        return m.text_cta_activity_list();
      case 'favorites': {
        if (!cta.mediaType) {
          return m.text_cta_favorites_list();
        }

        return cta.mediaType === 'show'
          ? m.text_cta_favorites_list_shows()
          : m.text_cta_favorites_list_movies();
      }
      default:
        return CtaItemIntlProvider.text({ cta });
    }
  },
  cta: {
    text: ({ cta }: CtaLinkMeta) => {
      switch (cta.type) {
        case 'up-next':
        case 'personal-activity':
          return m.link_text_browse_shows();
        case 'released':
          return m.link_text_browse_movies();
        case 'upcoming':
          return m.link_text_explore_shows();
        case 'watchlist':
        case 'favorites':
          return cta.mediaType === 'show'
            ? m.link_text_browse_shows()
            : m.link_text_browse_movies();
      }
    },
    label: CtaItemIntlProvider.cta.label,
  },
};
