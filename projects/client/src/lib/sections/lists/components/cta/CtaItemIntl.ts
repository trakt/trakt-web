import type { Cta, ListCta, MediaCta } from './models/Cta.ts';

export type CtaItemMeta = {
  cta: Cta;
};

export type CtaLinkMeta = {
  cta: MediaCta | ListCta;
};

export type CtaItemIntl = {
  text: (meta: CtaItemMeta) => string;
  cta: {
    text: (meta: CtaLinkMeta) => string;
    label: (meta: CtaLinkMeta) => string;
  };
};
