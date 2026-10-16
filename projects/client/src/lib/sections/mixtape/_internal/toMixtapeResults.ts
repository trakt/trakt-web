type Suggestion = { media: { id: number }; because: number };

const RESULT_COUNT = 3;

export function toMixtapeResults<T extends Suggestion>(
  suggestions: ReadonlyArray<T>,
  skips: ReadonlyArray<number>,
): T[] {
  return suggestions
    .filter(({ media }) => !skips.includes(media.id))
    .slice(0, RESULT_COUNT);
}
