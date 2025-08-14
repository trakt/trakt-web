import * as m from '$lib/features/i18n/messages.ts';
import type { CtaItemIntl, CtaItemMeta, CtaLinkMeta } from './CtaItemIntl.ts';
import { CtaItemIntlProvider } from './CtaItemIntlProvider.ts';

export const CtaPlaceholderIntlProvider: CtaItemIntl = {
  text: ({ cta }: CtaItemMeta) => {
    switch (cta) {
      case 'up-next':
      case 'released':
      case 'upcoming':
      case 'unreleased':
        return CtaItemIntlProvider.text({ cta });
      case 'activity':
        return m.text_cta_activity_list();
    }
  },
  cta: {
    text: ({ cta }: CtaLinkMeta) => {
      switch (cta) {
        case 'up-next':
          return m.link_text_browse_shows();
        case 'released':
          return m.link_text_browse_movies();
        case 'upcoming':
          return m.link_text_explore_shows();
        case 'unreleased':
          return m.link_text_explore_anticipated();
      }
    },
    label: CtaItemIntlProvider.cta.label,
  },
};
