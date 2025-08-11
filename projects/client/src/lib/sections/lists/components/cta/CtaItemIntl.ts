import type { Cta } from './models/Cta.ts';

export type CtaItemMeta = {
  cta: Cta;
};

export type CtaLinkMeta = {
  cta: Exclude<Cta, 'activity'>;
};

export type CtaItemIntl = {
  text: (meta: CtaItemMeta) => string;
  cta: {
    text: (meta: CtaLinkMeta) => string;
    label: (meta: CtaLinkMeta) => string;
  };
};
