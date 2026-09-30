import type { EmailSettingsResponse } from '$lib/requests/models/EmailSettingsResponse.ts';

export const EmailSettingsResponseMock: EmailSettingsResponse = {
  notifications: true,
  recaps: true,
  marketing: false,
};
