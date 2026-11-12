import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { nudgeQuery } from '$lib/requests/vip/nudgeQuery.ts';
import { combineLatest, map } from 'rxjs';
import { type NudgeCard, toNudgeCard } from './toNudgeCard.ts';
import { useNudgeDismissal } from './useNudgeDismissal.ts';

export function useNudgeCard() {
  const { limits } = useUser();
  const nudge = useQuery(nudgeQuery());
  const { isHidden, hide } = useNudgeDismissal();

  const card = combineLatest([nudge, limits, isHidden]).pipe(
    map(([$nudge, $limits, $isHidden]): NudgeCard | null => {
      if ($isHidden) return null;
      if ($nudge.isError) return null;
      if (!$nudge.data || !$limits) return null;

      return toNudgeCard({ nudge: $nudge.data, limits: $limits });
    }),
  );

  return { card, hide };
}
