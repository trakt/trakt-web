import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { MatchStripEntry } from './buildMatchStrip.ts';

export type MatchFace = Pick<
  UserProfile,
  'avatar' | 'slug' | 'username' | 'isVip'
>;

export type MatchHeroProps = {
  score: number;
  label: string;
  user: MatchFace;
  profile: MatchFace;
  backdropEntry?: MatchStripEntry;
};
