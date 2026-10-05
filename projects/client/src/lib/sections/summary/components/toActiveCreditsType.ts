import type { CreditGroup } from '$lib/sections/summary/models/CreditGroup.ts';
import type { CreditsType } from '$lib/sections/summary/models/CreditsType.ts';

type ActiveCreditsTypeProps = {
  groups: CreditGroup[];
  creditsType: CreditsType;
};

export function toActiveCreditsType(
  { groups, creditsType }: ActiveCreditsTypeProps,
): CreditsType {
  if (groups.some((group) => group.type === creditsType)) return creditsType;

  return groups.at(0)?.type ?? 'main';
}
