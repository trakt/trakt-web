import type { MemberTier } from './MemberTier.ts';

export type MemberLadderTier = Exclude<MemberTier, 'free' | 'director'>;
