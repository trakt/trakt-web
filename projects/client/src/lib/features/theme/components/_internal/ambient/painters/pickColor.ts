export function pickColor(colors: ReadonlyArray<string>): string {
  const index = Math.floor(Math.random() * colors.length);
  return colors.at(index) ?? 'white';
}
