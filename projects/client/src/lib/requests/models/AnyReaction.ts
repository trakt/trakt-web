import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { MediaReaction } from './MediaReaction.ts';

export type AnyReaction = Reaction | MediaReaction;
