import * as m from '$lib/features/i18n/messages.ts';

type ToNudgeMessageProps = {
  count: number;
  isMobile: boolean;
};

export function toNudgeMessage({ count, isMobile }: ToNudgeMessageProps) {
  if (!isMobile) {
    return m.smart_list_nudge_message({ count });
  }

  return count === 1
    ? m.smart_list_nudge_message_short_single({ count })
    : m.smart_list_nudge_message_short({ count });
}
