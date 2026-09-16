import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
import { addListCollaboratorRequest } from '$lib/requests/queries/users/addListCollaboratorRequest.ts';
import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { removeListCollaboratorRequest } from '$lib/requests/queries/users/removeListCollaboratorRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  type Observable,
} from 'rxjs';
import { buildCollaboratorCandidates } from './buildCollaboratorCandidates.ts';

export type CollaboratorCandidate = {
  profile: UserProfile;
  isCollaborator: boolean;
  isMutual: boolean;
};

type ManageCollaboratorsTarget = {
  listId: number;
  ownerSlug: string;
};

export function useManageCollaborators(
  target$: Observable<ManageCollaboratorsTarget>,
) {
  const { invalidate } = useInvalidator();

  // Only people who follow the owner are eligible to be added - the owner
  // can't spam invites at everyone they follow. Existing collaborators
  // still need to show up even if they've since unfollowed, so they're
  // merged in from the collaborators list itself, not just the followers
  // query. `following` is only used to tell mutual followers apart for
  // sorting - it never adds anyone to the candidate pool.
  const followersQuery$ = useQuery(
    target$.pipe(map(({ ownerSlug }) => followersQuery({ slug: ownerSlug }))),
  );
  const followingQuery$ = useQuery(
    target$.pipe(map(({ ownerSlug }) => followingQuery({ slug: ownerSlug }))),
  );
  const collaboratorsQuery$ = useQuery(
    target$.pipe(map(({ listId }) => listCollaboratorsQuery({ listId }))),
  );

  const followers = followersQuery$.pipe(map((query) => query.data ?? []));
  const following = followingQuery$.pipe(map((query) => query.data ?? []));
  const collaborators = collaboratorsQuery$.pipe(
    map((query) => query.data ?? []),
  );

  const isLoading = combineLatest([
    followersQuery$,
    followingQuery$,
    collaboratorsQuery$,
  ]).pipe(map((queries) => queries.some(toLoadingState)));

  const pendingUserId = new BehaviorSubject<number | null>(null);

  const candidates = combineLatest([followers, following, collaborators]).pipe(
    map(([followerProfiles, followingProfiles, collaboratorProfiles]) =>
      buildCollaboratorCandidates({
        followers: followerProfiles,
        following: followingProfiles,
        collaborators: collaboratorProfiles,
      })
    ),
  );

  const withTarget = async (
    profile: UserProfile,
    action: (target: ManageCollaboratorsTarget) => Promise<boolean>,
  ) => {
    const target = await firstValueFrom(target$);

    pendingUserId.next(profile.id);
    try {
      await action(target);
      await invalidate(InvalidateAction.List.Collaborators);
    } finally {
      pendingUserId.next(null);
    }
  };

  const addCollaborator = (profile: UserProfile) => {
    const userSlug = profile.slug ?? profile.username;

    return withTarget(
      profile,
      ({ listId }) => addListCollaboratorRequest({ listId, userSlug }),
    );
  };

  const removeCollaborator = (profile: UserProfile) => {
    const userSlug = profile.slug ?? profile.username;

    return withTarget(
      profile,
      ({ listId }) => removeListCollaboratorRequest({ listId, userSlug }),
    );
  };

  return {
    candidates,
    isLoading,
    pendingUserId: pendingUserId.asObservable(),
    addCollaborator,
    removeCollaborator,
  };
}
