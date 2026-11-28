import { TOPIC_MOVIES } from './_internal/shared/TOPIC_MOVIES.ts';
import type { TopicId } from './models/TopicId.ts';

export function pickTopic(
  watchlistedMovieIds: ReadonlySet<number> | Nil,
): TopicId | null {
  if (!watchlistedMovieIds) return null;

  const hasDune = watchlistedMovieIds.has(TOPIC_MOVIES.dunePartThree.id);
  const hasDoomsday = watchlistedMovieIds.has(TOPIC_MOVIES.avengersDoomsday.id);

  if (hasDune && hasDoomsday) return 'dunesday';
  if (hasDune) return 'dune-3';
  if (hasDoomsday) return 'avengers-doomsday';
  return null;
}
