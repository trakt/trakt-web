import { writable } from 'svelte/store';
import { vi } from 'vitest';

export const urlProxy = writable(new URL('https://example.com'));

vi.mock('$style/scss/variables/index.module.scss', () => ({
  breakpointDesktop: '1337px',
  breakpointMobile: '1337px',
  breakpointTabletLgMax: '1337px',
  breakpointTabletLgMin: '1337px',
  breakpointTabletSmMax: '1337px',
  breakpointTabletSmMin: '1337px',
}));
