const EDGE = 0.15;

export type TooltipEdge = 'start' | 'middle' | 'end';

export function tooltipEdge(index: number, count: number): TooltipEdge {
  const position = (index + 0.5) / Math.max(1, count);

  if (position < EDGE) return 'start';
  if (position > 1 - EDGE) return 'end';
  return 'middle';
}
