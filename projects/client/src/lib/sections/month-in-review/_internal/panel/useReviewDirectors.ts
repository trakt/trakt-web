import { useTraktTeam } from '$lib/features/team/useTraktTeam.ts';
import { map, of } from 'rxjs';

const DIRECTOR_COUNT = 3;

export function useReviewDirectors() {
  const { team } = useTraktTeam(of([]));

  return team.pipe(
    map((members) =>
      members
        .filter((member) => member.isDirector && !member.private)
        .slice(0, DIRECTOR_COUNT),
    ),
  );
}
