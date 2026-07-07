import type { ShortcutTrigger } from '@svelte-put/shortcut';

import { isTextInputTarget } from './isTextInputTarget';

type ArrowNavTriggersParams = {
  prevUrl: string;
  nextUrl: string;
  canGoNext?: boolean;
  goto: (url: string) => void;
};

const ARROW_NAV_MODIFIER: ShortcutTrigger['modifier'] = ['ctrl', 'meta'];

export function createArrowNavTriggers({
  prevUrl,
  nextUrl,
  canGoNext = true,
  goto,
}: ArrowNavTriggersParams): ShortcutTrigger[] {
  const navigate =
    (url: string) => ({ originalEvent }: { originalEvent: KeyboardEvent }) => {
      if (isTextInputTarget(originalEvent.target)) return;
      originalEvent.preventDefault();
      goto(url);
    };

  return [
    {
      key: 'ArrowLeft',
      modifier: ARROW_NAV_MODIFIER,
      callback: navigate(prevUrl),
    },
    {
      key: 'ArrowRight',
      modifier: ARROW_NAV_MODIFIER,
      enabled: canGoNext,
      callback: navigate(nextUrl),
    },
  ];
}
