import * as m from '$lib/features/i18n/messages.ts';
import type { CtaItemIntl, CtaItemMeta, CtaLinkMeta } from './CtaItemIntl.ts';

export const CtaItemIntlProvider: CtaItemIntl = {
  text: ({ cta }: CtaItemMeta) => {
    switch (cta.type) {
      case 'up-next': {
        if (!cta.mediaType) {
          return m.text_cta_up_next_media();
        }
        return cta.mediaType === 'show'
          ? m.text_cta_up_next()
          : m.text_cta_up_next_movies();
      }
      case 'start-watching': {
        if (!cta.mediaType) {
          return m.text_cta_start_watching_media();
        }
        return cta.mediaType === 'show'
          ? m.text_cta_start_watching_shows()
          : m.text_cta_start_watching_movies();
      }
      case 'released':
        return m.text_cta_watchlist_released();
      case 'upcoming': {
        if (!cta.mediaType) {
          return m.text_cta_upcoming_media();
        }

        return cta.mediaType === 'show'
          ? m.text_cta_upcoming()
          : m.text_cta_upcoming_movies();
      }
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
        default:
          return m.link_text_discover_more();
      }
    },
    label: ({ cta }: CtaLinkMeta) => {
      switch (cta.type) {
        case 'personal-list':
          return m.button_label_create_list();
        default:
          return m.link_label_discover_more();
      }
    },
  },
};
