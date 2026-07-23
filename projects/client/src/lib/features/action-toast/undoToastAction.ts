import { m } from '$lib/features/i18n/messages.ts';
import type { ActionToastAction } from './models/ActionToast.ts';

export function undoToastAction(
  onAction: ActionToastAction['onAction'],
): ActionToastAction {
  return {
    text: m.button_text_undo(),
    label: m.action_toast_label_undo(),
    onAction,
  };
}
