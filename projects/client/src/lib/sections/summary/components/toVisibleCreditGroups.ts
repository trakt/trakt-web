import type { CreditGroup } from '$lib/sections/summary/models/CreditGroup.ts';
import type { CreditsType } from '$lib/sections/summary/models/CreditsType.ts';

type VisibleCreditGroupsProps = {
  groups: CreditGroup[];
  searchTerm: string;
  creditsType: CreditsType;
};

/**
 * Narrows credit groups to what the drawer shows: the selected group when
 * browsing, or every matching member across all groups when searching.
 */
export function toVisibleCreditGroups(
  { groups, searchTerm, creditsType }: VisibleCreditGroupsProps,
) {
  const isSearching = searchTerm.length > 0;

  return groups
    .filter((group) => isSearching || group.type === creditsType)
    .map((group) => ({
      ...group,
      members: isSearching
        ? group.members.filter(({ description, name }) =>
          `${name} ${description}`.toLocaleLowerCase().includes(searchTerm)
        )
        : group.members,
    }))
    .filter((group) => group.members.length > 0);
}
