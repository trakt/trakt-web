import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EmailSettingsResponse } from '$lib/requests/models/EmailSettingsResponse.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { emailSettingsQuery } from '$lib/requests/queries/users/emailSettingsQuery.ts';
import { saveEmailSettingsRequest } from '$lib/requests/queries/users/saveEmailSettingsRequest.ts';
import { map } from 'rxjs';

export function useEmailSettings() {
  const query = useQuery(emailSettingsQuery());

  const change = useMutation(defineMutation({
    key: 'user:save-email-settings',
    request: (body: Partial<EmailSettingsResponse>) =>
      saveEmailSettingsRequest({ body }),
    invalidations: ({ data }) =>
      data ? [InvalidateAction.User.EmailSettings] : [],
  }));

  return {
    settings: query.pipe(map(($query) => $query.data)),
    isSaving: change.isPending,
    setNotifications: (notifications: boolean) =>
      change.mutate({ notifications }),
    setMarketing: (marketing: boolean) => change.mutate({ marketing }),
  };
}
