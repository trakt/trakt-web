import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { describe, expect, it } from 'vitest';
import { buildCollaboratorCandidates } from './buildCollaboratorCandidates.ts';

function toProfile(id: number): UserProfile {
  return {
    id,
    key: `user-${id}`,
    username: `user-${id}`,
    name: { full: `User ${id}`, first: 'User', last: `${id}` },
    private: false,
    isVip: false,
    isDirector: false,
    isDeleted: false,
    slug: `user-${id}`,
    avatar: { url: 'https://example.com/avatar.png' },
    location: undefined,
    about: undefined,
    cover: undefined,
    joinedAt: null,
  };
}

const [oneWayFollower, mutualFollower, unfollowedCollaborator] = [1, 2, 3]
  .map(toProfile);

describe('util: buildCollaboratorCandidates', () => {
  it('should mark followers who are not followed back as one-way, not mutual', () => {
    const result = buildCollaboratorCandidates({
      followers: [oneWayFollower],
      following: [],
      collaborators: [],
    });

    expect(result).to.deep.equal([
      { profile: oneWayFollower, isCollaborator: false, isMutual: false },
    ]);
  });

  it('should mark a follower the owner also follows back as mutual', () => {
    const result = buildCollaboratorCandidates({
      followers: [mutualFollower],
      following: [mutualFollower],
      collaborators: [],
    });

    expect(result).to.deep.equal([
      { profile: mutualFollower, isCollaborator: false, isMutual: true },
    ]);
  });

  it('should still surface a collaborator who has since unfollowed the owner', () => {
    const result = buildCollaboratorCandidates({
      followers: [],
      following: [],
      collaborators: [unfollowedCollaborator],
    });

    expect(result).to.deep.equal([
      {
        profile: unfollowedCollaborator,
        isCollaborator: true,
        isMutual: false,
      },
    ]);
  });

  it('should not duplicate a follower who is also a collaborator', () => {
    const result = buildCollaboratorCandidates({
      followers: [oneWayFollower],
      following: [],
      collaborators: [oneWayFollower],
    });

    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.deep.equal({
      profile: oneWayFollower,
      isCollaborator: true,
      isMutual: false,
    });
  });

  it('should rank collaborators first, then mutual followers, then one-way followers', () => {
    const result = buildCollaboratorCandidates({
      followers: [oneWayFollower, mutualFollower],
      following: [mutualFollower],
      collaborators: [unfollowedCollaborator],
    });

    expect(result.map((candidate) => candidate.profile.id)).to.deep.equal([
      unfollowedCollaborator.id,
      mutualFollower.id,
      oneWayFollower.id,
    ]);
  });

  it('should preserve relative order within a rank', () => {
    const firstFollower = toProfile(10);
    const secondFollower = toProfile(11);

    const result = buildCollaboratorCandidates({
      followers: [secondFollower, firstFollower],
      following: [],
      collaborators: [],
    });

    expect(result.map((candidate) => candidate.profile.id)).to.deep.equal([
      secondFollower.id,
      firstFollower.id,
    ]);
  });
});
