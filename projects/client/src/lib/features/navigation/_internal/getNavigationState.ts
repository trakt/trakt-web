import { focusSomething } from '$lib/features/navigation/_internal/focusSomething.ts';
import { getAllUsableLists } from '$lib/features/navigation/_internal/getAllUsableLists.ts';
import { getSelectableItems } from '$lib/features/navigation/_internal/getSelectableItems.ts';
import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

export function getNavigationState(
  target: DpadNavigationType.List | DpadNavigationType.Navbar,
) {
  focusSomething();

  const currentItem = assertDefined(
    document.activeElement,
    'No focusable item was found',
  );

  const currentList = assertDefined(
    currentItem.closest(
      `[data-dpad-navigation="${target}"]`,
    ),
    'No current list was found',
  );

  const items = getSelectableItems(currentList);
  const lists = getAllUsableLists();

  return {
    items,
    lists,
    focusedIndex: items.indexOf(currentItem),
    currentListIndex: lists.indexOf(currentList),
  };
}
