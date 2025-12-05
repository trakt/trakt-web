export function createPlyr(
  node: string | HTMLElement,
  options: Plyr.Options,
): Plyr {
  // deno-lint-ignore no-explicit-any
  const PlyrClass = (globalThis as any).Plyr;
  return new PlyrClass(node, options) as Plyr;
}
