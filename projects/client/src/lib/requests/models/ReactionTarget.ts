/**
 * What a media reaction is attached to. Movies and shows are addressed by
 * slug on the reactions routes, episodes by id.
 */
export type ReactionTarget =
  | { type: 'movie' | 'show'; id: number; slug: string }
  | { type: 'episode'; id: number };
