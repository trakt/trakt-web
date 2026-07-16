import type { ShortcutTrigger } from '@svelte-put/shortcut';

import { isTextInputTarget } from './isTextInputTarget';

type ArrowNavTriggersParams = {
  prevUrl?: string;
  nextUrl?: string;
  canGoNext?: boolean;
  modifier?: ShortcutTrigger['modifier'];
  // Evaluated at keypress time; when it returns false the key is left untouched
  // (no preventDefault) so a drawer stacked on top can still handle it.
  canNavigate?: () => boolean;
  goto: (url: string) => void;
};

const ARROW_NAV_MODIFIER: ShortcutTrigger['modifier'] = ['ctrl', 'meta'];

export function createArrowNavTriggers({
  prevUrl,
  nextUrl,
  canGoNext = true,
  modifier = ARROW_NAV_MODIFIER,
  canNavigate,
  goto,
}: ArrowNavTriggersParams): ShortcutTrigger[] {
  const navigate =
    (url: string | undefined) =>
    ({ originalEvent }: { originalEvent: KeyboardEvent }) => {
      if (!url || originalEvent.defaultPrevented) return;
      if (isTextInputTarget(originalEvent.target)) return;
      if (canNavigate && !canNavigate()) return;
      originalEvent.preventDefault();
      goto(url);
    };

  return [
    {
      key: 'ArrowLeft',
      modifier,
      enabled: prevUrl != null,
      callback: navigate(prevUrl),
    },
    {
      key: 'ArrowRight',
      modifier,
      enabled: canGoNext && nextUrl != null,
      callback: navigate(nextUrl),
    },
  ];
}
