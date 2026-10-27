import type { Season } from '$lib/requests/models/Season.ts';

type StoryProgressParams = {
  seasons: ReadonlyArray<Pick<Season, 'number' | 'episodes'>>;
  covered: ReadonlyArray<number>;
};

type StoryStepState = 'covered' | 'next' | 'pending';

type StoryStepStateParams = {
  number: number;
  coveredNumbers: ReadonlySet<number>;
  nextSeason: number | undefined;
};

function toStepState({
  number,
  coveredNumbers,
  nextSeason,
}: StoryStepStateParams): StoryStepState {
  if (coveredNumbers.has(number)) {
    return 'covered';
  }

  return number === nextSeason ? 'next' : 'pending';
}

export function toStoryProgress({ seasons, covered }: StoryProgressParams) {
  const regular = seasons.filter(({ number }) => number > 0);
  const coveredNumbers = new Set(covered);
  const nextSeason = regular.find(
    ({ number }) => !coveredNumbers.has(number),
  )?.number;

  const steps = regular.map(({ number }) => ({
    season: number,
    state: toStepState({ number, coveredNumbers, nextSeason }),
  }));

  return {
    steps,
    coveredCount: steps.filter(({ state }) => state === 'covered').length,
    totalCount: steps.length,
    episodeCount: regular
      .filter(({ number }) => coveredNumbers.has(number))
      .reduce((sum, { episodes }) => sum + episodes.count, 0),
    nextSeason: nextSeason ?? null,
  };
}
