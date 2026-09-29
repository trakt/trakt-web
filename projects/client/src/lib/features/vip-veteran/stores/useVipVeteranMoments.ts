import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import {
  combineLatest,
  filter,
  map,
  type Observable,
  shareReplay,
  take,
} from 'rxjs';
import { selectVipVeteranCelebration } from '../selectVipVeteranCelebration.ts';
import { toVipGraceDaysLeft } from '../toVipGraceDaysLeft.ts';
import type { VipVeteranCelebration } from '../VipVeteranCelebration.ts';
import {
  type VipVeteranMemory,
  VipVeteranMemorySchema,
} from '../VipVeteranMemory.ts';

const MEMORY_KEY_PREFIX = 'trakt-vip-veteran-memory';

type VipVeteranMoments = {
  celebration: VipVeteranCelebration | null;
  graceDaysLeft: number | null;
};

type UseVipVeteranMomentsParams = {
  veteran: Observable<VipVeteran | null>;
  isMe: Observable<boolean>;
};

function readMemory(key: string): VipVeteranMemory | null {
  try {
    const parsed = VipVeteranMemorySchema.safeParse(
      JSON.parse(safeLocalStorage.getItem(key) ?? 'null'),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function resolveMoments(
  { veteran, key, now }: { veteran: VipVeteran; key: string; now: Date },
): VipVeteranMoments {
  const selected = selectVipVeteranCelebration({
    veteran,
    memory: readMemory(key),
    today: now,
  });

  const daysLeft = toVipGraceDaysLeft(veteran.graceEndsAt, now);
  const today = toDayKey(now);
  const graceDaysLeft = selected.memory.graceShownOn === today
    ? null
    : daysLeft;

  const memory: VipVeteranMemory = {
    ...selected.memory,
    graceShownOn: graceDaysLeft != null ? today : selected.memory.graceShownOn,
  };
  safeLocalStorage.setItem(key, JSON.stringify(memory));

  return { celebration: selected.celebration, graceDaysLeft };
}

export function useVipVeteranMoments(
  { veteran, isMe }: UseVipVeteranMomentsParams,
) {
  const { user } = useUser();

  const moments = combineLatest([veteran, isMe, user]).pipe(
    filter(([$veteran, $isMe]) => $isMe && $veteran != null),
    take(1),
    map(([$veteran, , $user]) =>
      $veteran == null ? null : resolveMoments({
        veteran: $veteran,
        key: `${MEMORY_KEY_PREFIX}:${$user.id}`,
        now: new Date(),
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const ownMoments = combineLatest([moments, isMe]).pipe(
    map(([$moments, $isMe]) => $isMe ? $moments : null),
  );

  return {
    celebration: ownMoments.pipe(
      map(($moments) => $moments?.celebration ?? null),
    ),
    graceDaysLeft: ownMoments.pipe(
      map(($moments) => $moments?.graceDaysLeft ?? null),
    ),
  };
}
