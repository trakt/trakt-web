import type { ToggleOption } from '$lib/components/toggles/ToggleOption.ts';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { currentUserFollowRequestsQuery } from '$lib/features/auth/queries/currentUserFollowRequestsQuery.ts';
import { useIsMe } from '$lib/features/auth/stores/useIsMe.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { combineLatest, map } from 'rxjs';
import type { ProfileSocialListType } from '../models/ProfileSocialListType.ts';

function filterSocialOptions(
  options: ToggleOption<ProfileSocialListType>[],
  hasFollowRequests: boolean,
): ToggleOption<ProfileSocialListType>[] {
  return options.filter((option) =>
    option.value !== 'requests' || hasFollowRequests
  );
}

function findCurrentOption(
  options: ToggleOption<ProfileSocialListType>[],
  value: ProfileSocialListType,
) {
  return options.find((option) => option.value === value) ??
    options.find((option) => option.value === 'following') ??
    options.at(0);
}

export function useProfileSocialToggler(slug: string) {
  const { current, options, set } = useToggler('social');
  const { isMe } = useIsMe(slug);

  const followRequestsQuery = useQuery(
    isMe.pipe(
      map(($isMe) => currentUserFollowRequestsQuery({ enabled: $isMe })),
    ),
  );

  const followRequests = combineLatest([isMe, followRequestsQuery]).pipe(
    map(([$isMe, $query]) => $isMe ? $query.data ?? [] : []),
  );

  const visibleOptions = followRequests.pipe(
    map(($followRequests) =>
      filterSocialOptions(
        options as ToggleOption<ProfileSocialListType>[],
        $followRequests.length > 0,
      )
    ),
  );

  const visibleCurrent = combineLatest([current, visibleOptions]).pipe(
    map(([$current, $options]) =>
      findCurrentOption($options, $current.value) ?? $current
    ),
  );

  return {
    current: visibleCurrent,
    followRequests,
    options: visibleOptions,
    set,
  };
}
