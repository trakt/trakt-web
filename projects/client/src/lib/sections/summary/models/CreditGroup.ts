import type { CreditMember } from '$lib/sections/lists/models/CreditMember.ts';
import type { CreditsType } from './CreditsType.ts';

export type CreditGroup = {
  id: string;
  type: CreditsType;
  label: string;
  members: CreditMember[];
};
