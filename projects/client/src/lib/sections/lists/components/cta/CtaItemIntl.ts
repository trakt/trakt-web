import type { Cta, MediaCta } from './models/Cta.ts';

export type CtaItemMeta = {
  cta: Cta;
};

export type CtaLinkMeta = {
  cta: MediaCta;
};

export type CtaItemIntl = {
  text: (meta: CtaItemMeta) => string;
  cta: {
    text: (meta: CtaLinkMeta) => string;
    label: (meta: CtaLinkMeta) => string;
  };
};
