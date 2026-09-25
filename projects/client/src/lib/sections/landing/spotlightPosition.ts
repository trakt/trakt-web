export type SpotlightPosition =
  | 'front'
  | 'next'
  | 'after'
  | 'leaving'
  | 'hidden';

type SpotlightPositionParams = {
  index: number;
  active: number;
  count: number;
};

const STACK_POSITIONS: ReadonlyArray<SpotlightPosition> = [
  'front',
  'next',
  'after',
];

export function spotlightPosition(
  { index, active, count }: SpotlightPositionParams,
): SpotlightPosition {
  const offset = (index - active + count) % count;

  if (count > STACK_POSITIONS.length && offset === count - 1) {
    return 'leaving';
  }

  return STACK_POSITIONS.at(offset) ?? 'hidden';
}
