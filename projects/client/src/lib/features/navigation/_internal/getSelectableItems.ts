import { DpadNavigationType } from '../models/DpadNavigationType.ts';

export const getSelectableItems = (list: Element) => {
  return Array.from(
    list.querySelectorAll(
      `[data-dpad-navigation="${DpadNavigationType.Item}"]`,
    ),
  );
};
