import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { CollaboratorCandidate } from './useManageCollaborators.ts';

type BuildCollaboratorCandidatesParams = {
  followers: UserProfile[];
  following: UserProfile[];
  collaborators: UserProfile[];
};

function candidateRank(candidate: CollaboratorCandidate): number {
  if (candidate.isCollaborator) return 0;
  if (candidate.isMutual) return 1;
  return 2;
}

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
