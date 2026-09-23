import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { REACTIONS_CODE_MAP } from './reactionCodeMap.ts';

/**
 * Every reaction, in the order the taxonomy declares them.
 *
 * Derived from the code map rather than written out again, so the two cannot
 * drift: the map is keyed by `Reaction`, which means a value added to the
 * taxonomy and not to the map is a type error, and this list picks it up for
 * free.
 *
 * `Object.keys` is typed to `string[]` no matter what the record is keyed by,
 * so the assertion is unavoidable - the point of this module is that it lives
 * here once instead of at each of the four places that wanted the list.
 */
export const reactionsInOrder = Object.keys(REACTIONS_CODE_MAP) as Reaction[];
