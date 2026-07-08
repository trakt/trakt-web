import { map } from 'rxjs';
import { useAllTimeStatsDetails } from './useAllTimeStatsDetails.ts';

export function useAllTimeStats() {
  const { details, isLoading } = useAllTimeStatsDetails();

  const stats = details.pipe(
    map(({
      playCount,
      movieCount,
      showCount,
      episodeCount,
      ratingCount,
      commentCount,
    }) => ({
      playCount,
      movieCount,
      showCount,
      episodeCount,
      ratingCount,
      commentCount,
    })),
  );

  return {
    stats,
    isLoading,
  };
}
