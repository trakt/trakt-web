import type { ToggleOption } from '$lib/components/toggles/ToggleOption.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';

export function toCommentSortOptionsWithMine(
  options: ToggleOption<CommentSortType>[],
  isMineTabEnabled: boolean,
): ToggleOption<CommentSortType | 'mine'>[] {
  if (!isMineTabEnabled) return options;
  return [
    ...options,
    {
      value: 'mine',
      text: () => m.button_text_mine_reviews(),
      label: () => m.button_label_mine_reviews(),
    },
  ];
}
