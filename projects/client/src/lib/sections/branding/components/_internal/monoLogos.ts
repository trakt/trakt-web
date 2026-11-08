import LogoMark from '$lib/components/logo/LogoMark.svelte';
import LogoMarkCircle from '$lib/components/logo/LogoMarkCircle.svelte';
import type { BrandingLogo } from './BrandingLogo.ts';

export const monoLogos: ReadonlyArray<BrandingLogo> = [
  {
    key: 'circlemark-mono-light',
    name: 'trakt-circlemark-mono-light',
    label: 'Circle Mark — Light',
    artwork: LogoMarkCircle,
    shape: 'square',
    look: 'mono',
    fixedBackdrop: 'light',
  },
  {
    key: 'circlemark-mono-dark',
    name: 'trakt-circlemark-mono-dark',
    label: 'Circle Mark — Dark',
    artwork: LogoMarkCircle,
    shape: 'square',
    look: 'mono',
    fixedBackdrop: 'dark',
  },
  {
    key: 'logomark-mono-light',
    name: 'trakt-logomark-mono-light',
    label: 'Logo Mark — Light',
    artwork: LogoMark,
    shape: 'square',
    look: 'mono',
    fixedBackdrop: 'light',
  },
  {
    key: 'logomark-mono-dark',
    name: 'trakt-logomark-mono-dark',
    label: 'Logo Mark — Dark',
    artwork: LogoMark,
    shape: 'square',
    look: 'mono',
    fixedBackdrop: 'dark',
  },
];
