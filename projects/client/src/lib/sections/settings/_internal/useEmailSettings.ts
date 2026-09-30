import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EmailCategory } from '$lib/requests/models/EmailCategory.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { emailSettingsQuery } from '$lib/requests/queries/users/emailSettingsQuery.ts';
import { saveEmailSettingsRequest } from '$lib/requests/queries/users/saveEmailSettingsRequest.ts';
import { map } from 'rxjs';

type EmailSettingsChange = {
  category: EmailCategory;
  enabled: boolean;
};

export function useEmailSettings() {
  const query = useQuery(emailSettingsQuery());
  const { track } = useTrack(AnalyticsEvent.Settings);

  const change = useMutation(defineMutation({
    key: 'user:save-email-settings',
    request: (variables: EmailSettingsChange) =>
      saveEmailSettingsRequest(variables),
    invalidations: [InvalidateAction.User.EmailSettings],
  }));

  const set = async (category: EmailCategory, enabled: boolean) => {
    const success = await change.mutate({ category, enabled });

    if (!success) {
      return;
    }

    track({ settings: `emails_${category}` });
  };

  return {
    settings: query.pipe(map(($query) => $query.data)),
    isSaving: change.isPending,
    set,
  };
}
