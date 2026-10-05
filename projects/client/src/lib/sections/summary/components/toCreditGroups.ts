import * as m from '$lib/features/i18n/messages.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { toCreditMembers } from '$lib/sections/lists/toCreditMembers.ts';
import type { CreditGroup } from '$lib/sections/summary/models/CreditGroup.ts';

type CreditGroupsProps = {
  crew: MediaCrew;
  type: ExtendedMediaType;
};

/**
 * Every non-empty credit group for a title: main cast, supporting cast and
 * crew. Supporting cast only exists for show-like credits, and only when
 * there is a main cast to split from; otherwise all cast members are folded
 * into a single "Cast" group.
 */
export function toCreditGroups(
  { crew, type }: CreditGroupsProps,
): CreditGroup[] {
  const { cast, crew: crewMembers } = toCreditMembers({ crew, type });
  const supportingCast = type === 'movie'
    ? []
    : toCreditMembers({ crew: { ...crew, cast: crew.guestStars }, type }).cast;
  const isSplit = cast.length > 0 && supportingCast.length > 0;

  const groups: CreditGroup[] = [
    {
      id: 'main-cast',
      type: 'main',
      label: isSplit ? m.header_main_cast() : m.drawer_meta_info_cast(),
      members: isSplit ? cast : [...cast, ...supportingCast],
    },
    {
      id: 'supporting-cast',
      type: 'supporting',
      label: m.header_supporting_cast(),
      members: isSplit ? supportingCast : [],
    },
    {
      id: 'crew',
      type: 'crew',
      label: m.drawer_meta_info_crew(),
      members: crewMembers,
    },
  ];

  return groups.filter((group) => group.members.length > 0);
}
