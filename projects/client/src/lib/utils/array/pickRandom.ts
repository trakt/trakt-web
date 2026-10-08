export function pickRandom<T>(
  items: ReadonlyArray<T>,
  random: () => number = Math.random,
): T | undefined {
  return items.at(Math.floor(random() * items.length));
}
