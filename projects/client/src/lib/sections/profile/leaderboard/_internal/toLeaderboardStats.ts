import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import type { LeaderboardEntry } from '$lib/requests/models/LeaderboardEntry.ts';
import { toStatLabel } from './toStatLabel.ts';

type LeaderboardStats = Pick<LeaderboardEntry, 'totalPlays' | 'totalMinutes'>;

export function toLeaderboardStats(
  { totalPlays, totalMinutes }: LeaderboardStats,
  locale: AvailableLanguage,
): string | null {
  const parts = [
    totalPlays == null ? null : toStatLabel(totalPlays, 'plays', locale),
    totalMinutes == null
      ? null
      : toStatLabel(Math.round(totalMinutes / 60), 'hours', locale),
  ].filter((part) => part != null);

  return parts.length > 0 ? parts.join(' · ') : null;
}
