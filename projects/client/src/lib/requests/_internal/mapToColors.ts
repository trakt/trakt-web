export function mapToColors(
  colors: string[] | Nil,
): [string, string] {
  if (!colors) {
    return ['transparent', 'transparent'];
  }

  const [firstColor = 'transparent', secondColor = 'transparent'] = colors;

  return [firstColor, secondColor];
}
