import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

export const urlProxy = new BehaviorSubject(new URL('https://example.com'));

vi.mock('$style/scss/variables/index.module.scss', () => ({
  default: {
    'breakpoint-desktop': '1337px',
    'breakpoint-mobile': '1337px',
    'breakpoint-tablet-lg-max': '1337px',
    'breakpoint-tablet-lg-min': '1337px',
    'breakpoint-tablet-sm-max': '1337px',
    'breakpoint-tablet-sm-min': '1337px',
  },
}));
