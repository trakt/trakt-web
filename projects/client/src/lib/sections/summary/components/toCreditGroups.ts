import * as m from '$lib/features/i18n/messages.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { toCreditMembers } from '$lib/sections/lists/toCreditMembers.ts';

type CreditGroupsProps = {
  crew: MediaCrew;
  type: ExtendedMediaType;
  searchTerm: string;
  mainCastLabel?: string;
  splitCast: boolean;
};

export function toCreditGroups(
  { crew, type, searchTerm, mainCastLabel, splitCast }: CreditGroupsProps,
) {
  const { cast, crew: crewMembers } = toCreditMembers({ crew, type });
  const supportingCast = type === 'movie'
    ? []
    : toCreditMembers({ crew: { ...crew, cast: crew.guestStars }, type }).cast;

  return [
    {
      id: 'main-cast',
      type: 'cast' as const,
      label: mainCastLabel ??
        (supportingCast.length > 0
          ? m.header_main_cast()
          : m.drawer_meta_info_cast()),
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
  ].map((group) => ({
    ...group,
    members: searchTerm
      ? group.members.filter(({ description, name }) =>
        `${name} ${description}`.toLocaleLowerCase().includes(searchTerm)
      )
      : group.members,
  })).filter((group) => group.members.length > 0);
}
