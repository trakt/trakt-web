import type { CreditGroup } from '$lib/sections/summary/models/CreditGroup.ts';
import type { CreditsType } from '$lib/sections/summary/models/CreditsType.ts';

export type CreditsTogglerProps = {
  groups: CreditGroup[];
  value: CreditsType;
  onChange: (value: CreditsType) => void;
};
