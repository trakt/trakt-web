import { browser } from '$app/environment';

export function computeVariable(variable: string): string | Nil {
  if (!browser) return;

  return getComputedStyle(globalThis.document.documentElement).getPropertyValue(
    variable,
  );
}
