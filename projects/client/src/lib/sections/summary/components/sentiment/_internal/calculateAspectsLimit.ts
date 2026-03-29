const CHARACTER_COUNT_THRESHOLD = 35;
const SHORT_ASPECTS_LIMIT = 4;
const LONG_ASPECTS_LIMIT = 3;

export function calculateAspectsLimit(pros: string[], cons: string[]): number {
  const allAspects = [...pros, ...cons];
  if (allAspects.length === 0) return SHORT_ASPECTS_LIMIT;

  const averageLength =
    allAspects.reduce((sum, aspect) => sum + aspect.length, 0) /
    allAspects.length;

  return averageLength <= CHARACTER_COUNT_THRESHOLD
    ? SHORT_ASPECTS_LIMIT
    : LONG_ASPECTS_LIMIT;
}
