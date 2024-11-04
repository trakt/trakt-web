import { Theme } from '../models/Theme.ts';

export const coerceTheme = (theme: string | undefined): Theme => {
  switch (theme) {
    case Theme.Light:
    case Theme.Dark:
      return theme;
    default:
      return Theme.Dark;
  }
};
