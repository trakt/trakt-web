import type { ListPrivacy } from '$lib/requests/models/ListPrivacy.ts';

export type ListPrivacySwitchProps = {
  privacy: ListPrivacy;
  disabled?: boolean;
  hasLegacyState?: boolean;
  onChange: (privacy: 'public' | 'private') => void;
};
