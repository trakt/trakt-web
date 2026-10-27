const WORDS_PER_MINUTE = 200;

export function toReadingMinutes(texts: ReadonlyArray<string>): number {
  const words = texts.join(' ').split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
