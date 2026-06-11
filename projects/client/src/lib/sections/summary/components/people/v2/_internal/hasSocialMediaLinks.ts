import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';

export function hasSocialMediaLinks(person: PersonSummary): boolean {
  const { facebook, x, instagram } = person.socialMedia ?? {};
  return Boolean(facebook || x || instagram);
}
