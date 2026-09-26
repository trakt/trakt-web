import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { CollaboratorCandidate } from './useManageCollaborators.ts';

type BuildCollaboratorCandidatesParams = {
  followers: UserProfile[];
  following: UserProfile[];
  collaborators: UserProfile[];
};

// Sorted collaborators first, then mutual followers, then one-way
// followers, so the people you're most likely to act on sit at the top.
// `Array.prototype.sort` is stable, so relative order within each tier is
// preserved.
function candidateRank(candidate: CollaboratorCandidate): number {
  if (candidate.isCollaborator) return 0;
  if (candidate.isMutual) return 1;
  return 2;
}

// Only people who follow the owner are eligible to be added - the owner
// can't spam invites at everyone they follow. Existing collaborators still
// need to show up even if they've since unfollowed, so they're merged in
// from the collaborators list itself, not just the followers list.
// `following` is only used to tell mutual followers apart for sorting - it
// never adds anyone to the candidate pool.
export function buildCollaboratorCandidates(
  { followers, following, collaborators }: BuildCollaboratorCandidatesParams,
): CollaboratorCandidate[] {
  const collaboratorIds = new Set(collaborators.map((profile) => profile.id));
  const followerIds = new Set(followers.map((profile) => profile.id));
  const followingIds = new Set(following.map((profile) => profile.id));
  const unfollowedCollaborators = collaborators.filter(
    (profile) => !followerIds.has(profile.id),
  );

  return [...followers, ...unfollowedCollaborators]
    .map((profile) => ({
      profile,
      isCollaborator: collaboratorIds.has(profile.id),
      isMutual: followingIds.has(profile.id),
    }))
    .sort((a, b) => candidateRank(a) - candidateRank(b));
}
