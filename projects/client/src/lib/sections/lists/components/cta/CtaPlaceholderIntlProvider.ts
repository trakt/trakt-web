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
        case 'personal-list':
          return CtaItemIntlProvider.cta.text({ cta });
        default: {
          if ('mediaType' in cta && cta.mediaType) {
            return cta.mediaType === 'show'
              ? m.link_text_discover_shows()
              : m.link_text_discover_movies();
          }

          return m.link_text_discover_media();
        }
      }
    },
    label: ({ cta }: CtaLinkMeta) => {
      switch (cta.type) {
        case 'personal-list':
          return CtaItemIntlProvider.cta.label({ cta });
        default: {
          if ('mediaType' in cta && cta.mediaType) {
            return cta.mediaType === 'show'
              ? m.link_label_discover_shows()
              : m.link_label_discover_movies();
          }

          return m.link_label_discover_media();
        }
      }
    },
  },
};
