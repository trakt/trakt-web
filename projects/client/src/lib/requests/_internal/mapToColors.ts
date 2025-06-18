export function mapToColors(
  colors: string[] | Nil,
): [string, string] | undefined {
  if (!colors || colors.length === 0) {
    return;
  }

  const [firstColor = 'transparent', secondColor = 'transparent'] = colors;

  return [firstColor, secondColor];
}
