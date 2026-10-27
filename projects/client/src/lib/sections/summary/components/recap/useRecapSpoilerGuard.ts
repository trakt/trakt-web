import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useMediaSpoiler } from '$lib/features/spoilers/useMediaSpoiler.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { distinctUntilChanged, map } from 'rxjs';

type RecapSpoilerGuardProps = {
  show: Pick<ShowEntry, 'id'>;
  season: Season;
};

export function useRecapSpoilerGuard({ show, season }: RecapSpoilerGuardProps) {
  const { history } = useUser();
  const { isSpoilerHidden } = useMediaSpoiler({
    type: 'season',
    media: season,
    show,
  });

  const watched = history.pipe(
    map(
      ($history) =>
        $history?.shows.get(show.id)?.playsPerSeason.get(season.number) ?? 0,
    ),
    distinctUntilChanged(),
  );

  return { isSpoilerHidden, watched };
}
