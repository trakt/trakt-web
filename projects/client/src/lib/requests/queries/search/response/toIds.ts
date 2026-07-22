export function toIds(input: { id: string; slug: string }) {
  return {
    trakt: parseInt(input.id, 10),
    slug: input.slug,
  };
}
