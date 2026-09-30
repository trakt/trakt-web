import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type EmailSettings,
  EmailSettingsSchema,
} from '$lib/requests/models/EmailSettings.ts';
import {
  type EmailSettingsResponse,
  EmailSettingsResponseSchema,
} from '$lib/requests/models/EmailSettingsResponse.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';

const emailSettingsRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/users/settings/emails',
  });

  return {
    body: EmailSettingsResponseSchema.parse(await response.json()),
    status: response.status,
  };
};

function mapToEmailSettings(body: EmailSettingsResponse): EmailSettings {
  return {
    hasNotifications: body.notifications,
    hasMarketing: body.marketing,
  };
}

export const emailSettingsQuery = defineQuery({
  key: 'emailSettings',
  invalidations: [InvalidateAction.User.EmailSettings],
  dependencies: [],
  request: emailSettingsRequest,
  mapper: (response) => mapToEmailSettings(response.body),
  schema: EmailSettingsSchema,
  ttl: time.minutes(5),
});
