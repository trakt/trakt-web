import type {
  MediaTrivia,
  TriviaCategory,
} from '$lib/requests/models/MediaTrivia.ts';

type TriviaGroup = {
  category: TriviaCategory;
  facts: ReadonlyArray<MediaTrivia>;
};

/**
 * Facts gathered under their category, so each category is named once above
 * its facts rather than on every one. Groups follow the order of their first
 * fact and facts keep their order inside a group, so the list's lead fact
 * still leads.
 */
export function toTriviaGroups(
  facts: ReadonlyArray<MediaTrivia>,
): ReadonlyArray<TriviaGroup> {
  const categories = [...new Set(facts.map(({ category }) => category))];

  return categories.map((category) => ({
    category,
    facts: facts.filter((fact) => fact.category === category),
  }));
}
