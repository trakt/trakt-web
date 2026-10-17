export function toNewestRounds<T>(rounds: ReadonlyArray<ReadonlyArray<T>>) {
  return rounds
    .map((media, index) => ({ media, round: index + 1 }))
    .filter(({ media }) => media.length > 0)
    .reverse();
}
