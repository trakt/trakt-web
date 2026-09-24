const PATTERN = /<pattern id="([^"]+)"[^>]*>([\s\S]*?)<\/pattern>/g;
const GRADIENT = /<(?:linear|radial)Gradient id="([^"]+)"/g;
const RECT = /<rect\b/g;

function countOf(body: string, pattern: RegExp): number {
  return (body.match(pattern) ?? []).length;
}

type UnwrappedPattern = {
  source: string;
  body: string;
  gradientId: string;
};

export function unwrapGradientPatterns(svg: string): string {
  const patterns = new Map<string, UnwrappedPattern>();

  for (const [source, id, body] of svg.matchAll(PATTERN)) {
    if (!source || !id || !body || countOf(body, RECT) !== 1) {
      continue;
    }

    const [match] = body.match(GRADIENT) ?? [];

    if (!match || countOf(body, GRADIENT) !== 1) {
      continue;
    }

    const gradientId = /id="([^"]+)"/.exec(match)?.at(1);

    if (gradientId) {
      patterns.set(id, { source, body, gradientId });
    }
  }

  return [...patterns].reduce(
    (current, [patternId, { source, body, gradientId }]) =>
      current
        .replaceAll(`url(#${patternId})`, `url(#${gradientId})`)
        .replace(source, () => body),
    svg,
  );
}
