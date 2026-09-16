import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
import { addListCollaboratorRequest } from '$lib/requests/queries/users/addListCollaboratorRequest.ts';
import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { removeListCollaboratorRequest } from '$lib/requests/queries/users/removeListCollaboratorRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { toUserSlug } from '$lib/utils/profile/toUserSlug.ts';
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

  // Eligibility/sorting rules for these three queries live in
  // buildCollaboratorCandidates - this just fetches the raw inputs.
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

  // `isPending` only, not `isFetching` - a mutation invalidates
  // `collaboratorsQuery$` and refetches it in the background, and that
  // refetch shouldn't blank the list the row-level `pendingUserId` state is
  // already covering.
  const isLoading = combineLatest([
    followersQuery$,
    followingQuery$,
    collaboratorsQuery$,
  ]).pipe(map((queries) => queries.some((query) => query.isPending)));

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
    const userSlug = toUserSlug(profile);

    return withTarget(
      profile,
      ({ listId }) => addListCollaboratorRequest({ listId, userSlug }),
    );
  };

  const removeCollaborator = (profile: UserProfile) => {
    const userSlug = toUserSlug(profile);

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
