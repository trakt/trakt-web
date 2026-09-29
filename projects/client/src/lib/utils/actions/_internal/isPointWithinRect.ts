type IsPointWithinRectParams = {
  rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;
  x: number;
  y: number;
  margin?: number;
};

export function isPointWithinRect(
  { rect, x, y, margin = 0 }: IsPointWithinRectParams,
): boolean {
  return x >= rect.left - margin &&
    x <= rect.right + margin &&
    y >= rect.top - margin &&
    y <= rect.bottom + margin;
}
