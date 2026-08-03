export function toUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
