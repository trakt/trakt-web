export function unixToDateTime(unix: number | Nil): string | Nil {
  if (unix == null || isNaN(unix)) {
    return null;
  }

  return new Date(unix * 1000).toISOString();
}
