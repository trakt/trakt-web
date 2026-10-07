const MAX_LENGTH = 200;
const REMOVED = '[removed]';

const PATTERNS: ReadonlyArray<RegExp> = [
  /\S+@\S+\.\S+/g,
  /https?:\/\/\S+|www\.\S+/g,
  /@\w{2,}/g,
  /\d{5,}/g,
];

export function cleanCancelDetails(text: string): string {
  return PATTERNS
    .reduce((cleaned, pattern) => cleaned.replace(pattern, REMOVED), text)
    .trim()
    .slice(0, MAX_LENGTH);
}
