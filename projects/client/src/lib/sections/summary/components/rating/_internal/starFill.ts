type StarFillParams = {
  value: number;
  index: number;
  allowHalf: boolean;
};

type StarFill = 'none' | 'half' | 'full';

// Fill state for the star at `index` given the current (preview or committed)
// rating `value`. Half is only reachable when the rating system allows it.
export function starFill(
  { value, index, allowHalf }: StarFillParams,
): StarFill {
  const star = index + 1;

  if (value >= star) return 'full';
  if (allowHalf && value >= star - 0.5) return 'half';
  return 'none';
}
