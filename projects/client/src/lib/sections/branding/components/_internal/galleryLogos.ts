import Logo from '$lib/components/logo/Logo.svelte';
import LogoMark from '$lib/components/logo/LogoMark.svelte';
import LogoMarkCircle from '$lib/components/logo/LogoMarkCircle.svelte';
import LogoText from '$lib/components/logo/LogoText.svelte';
import type { BrandingLogo } from './BrandingLogo.ts';

export const galleryLogos: ReadonlyArray<BrandingLogo> = [
  {
    key: 'logo',
    name: 'trakt-logo',
    label: 'Full Logo',
    artwork: Logo,
    shape: 'wide',
    look: 'plain',
  },
  {
    key: 'logomark',
    name: 'trakt-logomark',
    label: 'Logo Mark',
    artwork: LogoMark,
    shape: 'square',
    look: 'branded',
  },
  {
    key: 'circlemark',
    name: 'trakt-circlemark',
    label: 'Circle Mark',
    artwork: LogoMarkCircle,
    shape: 'square',
    look: 'branded',
  },
  {
    key: 'text-logo',
    name: 'trakt-text-logo',
    label: 'Text Logo',
    artwork: LogoText,
    shape: 'wide',
    look: 'plain',
  },
];
