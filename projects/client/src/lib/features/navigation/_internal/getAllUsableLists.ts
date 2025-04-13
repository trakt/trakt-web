import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export function getAllUsableLists() {
  const lists = Array.from(
    document.querySelectorAll(
      `[data-dpad-navigation="${DpadNavigationType.List}"]`,
    ),
  );

  return lists.filter((list) =>
    list.querySelector(`[data-dpad-navigation="${DpadNavigationType.Item}"]`)
  );
}
