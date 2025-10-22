import * as m from '$lib/features/i18n/messages.ts';
import type { CtaItemIntl, CtaItemMeta, CtaLinkMeta } from './CtaItemIntl.ts';

export const CtaItemIntlProvider: CtaItemIntl = {
  text: ({ cta }: CtaItemMeta) => {
    switch (cta.type) {
      case 'up-next':
        return m.text_cta_up_next();
      case 'released':
        return m.text_cta_watchlist_released();
      case 'upcoming':
        return m.text_cta_upcoming();
      case 'social':
      case 'activity':
        return m.text_cta_activity();
      case 'personal-activity':
        return m.text_cta_personal_activity();
      case 'watchlist': {
        if (!cta.mediaType) {
          return m.text_cta_watchlist();
        }

        return cta.mediaType === 'show'
          ? m.text_cta_watchlist_shows()
          : m.text_cta_watchlist_movies();
      }
      case 'favorites': {
        if (!cta.mediaType) {
          return m.text_cta_favorites();
        }

        return cta.mediaType === 'show'
          ? m.text_cta_favorites_shows()
          : m.text_cta_favorites_movies();
      }
      case 'personal-list': {
        return m.text_cta_personal_lists();
      }
    }
  },
  cta: {
    text: ({ cta }: CtaLinkMeta) => {
      switch (cta.type) {
        case 'personal-list':
          return m.button_text_cta_create_list();
        case 'upcoming':
          return m.link_text_explore_more();
        default:
          return m.link_text_browse_more();
      }
    },
    label: ({ cta }: CtaLinkMeta) => {
      switch (cta.type) {
        case 'personal-list':
          return m.button_label_create_list();
        case 'up-next':
        case 'personal-activity':
          return m.link_label_browse_shows();
        case 'released':
          return m.link_label_browse_movies();
        case 'upcoming':
          return m.link_label_explore_shows();
        case 'watchlist':
        case 'favorites':
          return cta.mediaType === 'show'
            ? m.link_label_browse_shows()
            : m.link_label_browse_movies();
      }
    },
  },
};
