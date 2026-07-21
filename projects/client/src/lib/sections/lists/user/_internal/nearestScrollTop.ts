type NearestScrollTopProps = {
  elementTop: number;
  elementHeight: number;
  marginStart: number;
  marginEnd: number;
  scrollTop: number;
  viewportHeight: number;
};

export function nearestScrollTop({
  elementTop,
  elementHeight,
  marginStart,
  marginEnd,
  scrollTop,
  viewportHeight,
}: NearestScrollTopProps): number | null {
  const top = elementTop - marginStart;
  const bottom = elementTop + elementHeight + marginEnd;

  if (top < scrollTop) {
    return Math.max(top, 0);
  }

  if (bottom > scrollTop + viewportHeight) {
    return Math.max(bottom - viewportHeight, 0);
  }

  return null;
}
