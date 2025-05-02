import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import { getNavigationScope } from './getNavigationScope.ts';
import { getSelectableItems } from './getSelectableItems.ts';

export function getAllUsableLists() {
  const scope = getNavigationScope();

  const lists = Array.from(
    scope.querySelectorAll(
      `[data-dpad-navigation="${DpadNavigationType.List}"]`,
    ),
  );

  return lists.filter((list) => {
    const selectableItems = getSelectableItems(list);
    return selectableItems.length > 0;
  });
}
