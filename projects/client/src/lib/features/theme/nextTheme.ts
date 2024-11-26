import { Theme } from './models/Theme.ts';

export const nextTheme = (theme: Theme) => {
  switch (theme) {
    case Theme.Dark:
      return Theme.Light;
    case Theme.Light:
      return Theme.Dark;
    case Theme.Auto:
    default:
      return globalThis.window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        ? Theme.Light
        : Theme.Dark;
  }
};
