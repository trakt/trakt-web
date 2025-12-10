import { BehaviorSubject } from 'rxjs';
import { safeLocalStorage } from '../utils/storage/safeStorage.ts';

export function useCollapsedSection(
  key: string,
  defaultValue = false,
) {
  const isCollapsed = new BehaviorSubject(
    JSON.parse(safeLocalStorage.getItem(key) ?? JSON.stringify(defaultValue)),
  );

  return {
    isCollapsed: isCollapsed.asObservable(),
    toggle: () => {
      const newValue = !isCollapsed.value;
      isCollapsed.next(newValue);
      safeLocalStorage.setItem(
        key,
        JSON.stringify(newValue),
      );
      return newValue;
    },
  };
}
