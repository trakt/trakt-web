import * as m from '$lib/features/i18n/messages.ts';
import type { CtaItemIntl, CtaItemMeta, CtaLinkMeta } from './CtaItemIntl.ts';

export const CtaItemIntlProvider: CtaItemIntl = {
  text: ({ cta }: CtaItemMeta) => {
    switch (cta) {
      case 'up-next':
        return m.text_cta_up_next();
      case 'released':
        return m.text_cta_watchlist_released();
      case 'upcoming':
        return m.text_cta_upcoming();
      case 'unreleased':
        return m.text_cta_watchlist_unreleased();
      case 'activity':
        return m.text_cta_activity();
      case 'personal-activity':
        return m.text_cta_personal_activity();
    }
  },
  cta: {
    text: ({ cta }: CtaLinkMeta) => {
      switch (cta) {
        case 'up-next':
        case 'personal-activity':
          return m.link_text_browse_more();
        case 'released':
          return m.link_text_browse_more();
        case 'upcoming':
          return m.link_text_explore_more();
        case 'unreleased':
          return m.link_text_explore_more();
      }
    },
    label: ({ cta }: CtaLinkMeta) => {
      switch (cta) {
        case 'up-next':
        case 'personal-activity':
          return m.link_label_browse_shows();
        case 'released':
          return m.link_label_browse_movies();
        case 'upcoming':
          return m.link_label_explore_shows();
        case 'unreleased':
          return m.link_label_explore_movies();
      }
    },
  },
};
