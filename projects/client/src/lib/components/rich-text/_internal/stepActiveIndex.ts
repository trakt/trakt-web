type StepActiveIndexProps = {
  key: string;
  activeIndex: number;
  count: number;
};

export function stepActiveIndex(
  { key, activeIndex, count }: StepActiveIndexProps,
): number | null {
  if (count === 0) return null;
  if (key !== 'ArrowDown' && key !== 'ArrowUp') return null;

  const step = key === 'ArrowDown' ? 1 : -1;
  return (activeIndex + step + count) % count;
}
