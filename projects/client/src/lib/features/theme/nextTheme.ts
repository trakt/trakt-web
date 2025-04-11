import { Theme } from './models/Theme.ts';

export const nextTheme = (theme: Theme) => {
  switch (theme) {
    case Theme.System:
      return Theme.Light;
    case Theme.Light:
      return Theme.Dark;
    case Theme.Dark:
      return Theme.System;
  }
};
