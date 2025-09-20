export function mapToTraktRating<T extends number | Nil>(
  rating: T,
): T extends number ? number : undefined;
export function mapToTraktRating(rating?: number | Nil): number | undefined {
  if (rating === null || rating === undefined) {
    return undefined;
  }

  return Number((rating / 10).toFixed(4));
}
