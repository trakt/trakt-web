import * as m from '$lib/features/i18n/messages.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { toCreditMembers } from '$lib/sections/lists/toCreditMembers.ts';

type CreditsType = 'cast' | 'crew';

type CreditGroupsProps = {
  crew: MediaCrew;
  type: ExtendedMediaType;
  searchTerm: string;
  creditsType: CreditsType;
  splitCast: boolean;
};

export function toCreditGroups(
  { crew, type, searchTerm, creditsType, splitCast }: CreditGroupsProps,
) {
  const isSearching = searchTerm.length > 0;
  const { cast, crew: crewMembers } = toCreditMembers({ crew, type });
  const supportingCast = type === 'movie'
    ? []
    : toCreditMembers({ crew: { ...crew, cast: crew.guestStars }, type }).cast;

  const groups = [
    {
      id: 'main-cast',
      type: 'cast' as const,
      label: type === 'movie'
        ? m.drawer_meta_info_cast()
        : m.header_main_cast(),
      members: splitCast ? cast : [...cast, ...supportingCast],
    },
    {
      id: 'supporting-cast',
      type: 'cast' as const,
      label: cast.length > 0
        ? m.header_supporting_cast()
        : m.drawer_meta_info_cast(),
      members: splitCast ? supportingCast : [],
    },
    {
      id: 'crew',
      type: 'crew' as const,
      label: m.drawer_meta_info_crew(),
      members: crewMembers,
    },
  ]
    .filter((group) => isSearching || group.type === creditsType)
    .map((group) => ({
      ...group,
      showHeader: isSearching || group.type === 'cast',
      members: isSearching
        ? group.members.filter(({ description, name }) =>
          `${name} ${description}`.toLocaleLowerCase().includes(searchTerm)
        )
        : group.members,
    }))
    .filter((group) => group.members.length > 0);

  const firstGroup = groups.at(0);
  if (splitCast || !firstGroup) return groups;

  return [{
    ...firstGroup,
    id: 'credits',
    showHeader: false,
    members: groups.flatMap((group) => group.members),
  }];
}
