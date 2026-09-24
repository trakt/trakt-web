export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}
