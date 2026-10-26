import type { Breadcrumb } from '@sentry/sveltekit';
import { describeValue } from './_internal/describeValue.ts';

type RejectionInput = {
  event: Pick<Event, 'type' | 'isTrusted'> & {
    reason?: unknown;
    detail?: unknown;
  };
  dispatchProbe: Error;
};

export function toRejectionBreadcrumb({
  event,
  dispatchProbe,
}: RejectionInput): Breadcrumb {
  const { constructorName } = describeValue(event);

  return {
    category: 'rejection',
    level: 'warning',
    message: `${constructorName ?? 'Event'} ${event.type}`,
    data: {
      isTrusted: event.isTrusted,
      reason: describeValue(event.reason),
      detail: 'detail' in event ? describeValue(event.detail) : null,
      dispatchStack: event.isTrusted
        ? null
        : describeValue(dispatchProbe).stack,
    },
  };
}
