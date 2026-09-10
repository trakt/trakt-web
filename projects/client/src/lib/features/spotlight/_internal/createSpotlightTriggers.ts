import { isTextInputTarget } from '$lib/utils/events/isTextInputTarget.ts';
import type { ShortcutTrigger } from '@svelte-put/shortcut';

type SpotlightTriggersParams = {
  enabled: boolean;
  open: () => void;
  toggle: () => void;
};

const TOGGLE_MODIFIER: ShortcutTrigger['modifier'] = ['ctrl', 'meta'];

export function createSpotlightTriggers({
  enabled,
  open,
  toggle,
}: SpotlightTriggersParams): ShortcutTrigger[] {
  return [
    {
      key: '/',
      enabled,
      callback: ({ originalEvent }) => {
        if (isTextInputTarget(originalEvent.target)) return;
        if (
          originalEvent.ctrlKey || originalEvent.metaKey || originalEvent.altKey
        ) {
          return;
        }
        originalEvent.preventDefault();
        open();
      },
    },
    {
      key: 'k',
      modifier: TOGGLE_MODIFIER,
      enabled,
      callback: ({ originalEvent }) => {
        originalEvent.preventDefault();
        toggle();
      },
    },
  ];
}
