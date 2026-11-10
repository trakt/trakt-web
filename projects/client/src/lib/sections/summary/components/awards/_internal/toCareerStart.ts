import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';

export function toCareerStart(
  credits: ReadonlyArray<MediaCredits | Nil>,
): number | undefined {
  const years = credits
    .flatMap((credit) => [...(credit?.values() ?? [])].flat())
    .map((credit) => credit.media.year)
    .filter((year): year is number => year != null && year > 0);

  return years.length > 0 ? Math.min(...years) : undefined;
}
