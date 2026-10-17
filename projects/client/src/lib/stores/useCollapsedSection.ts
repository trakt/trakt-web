import { BehaviorSubject } from 'rxjs';
import { safeLocalStorage } from '../utils/storage/safeStorage.ts';
import { safeJsonParse } from '$lib/utils/json/safeJsonParse.ts';

export function useCollapsedSection(
  key: string,
  defaultValue = false,
) {
  const isCollapsed = new BehaviorSubject(
    safeJsonParse(safeLocalStorage.getItem(key), defaultValue),
  );

  return {
    isCollapsed: isCollapsed.asObservable(),
    toggle: () => {
      const newValue = !isCollapsed.value;
      safeLocalStorage.setItem(
        key,
        JSON.stringify(newValue),
      );
      isCollapsed.next(newValue);
    },
  };
}
