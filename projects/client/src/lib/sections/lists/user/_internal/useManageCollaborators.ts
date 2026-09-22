import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
import { addListCollaboratorRequest } from '$lib/requests/queries/users/addListCollaboratorRequest.ts';
import { followersQuery } from '$lib/requests/queries/users/followersQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { removeListCollaboratorRequest } from '$lib/requests/queries/users/removeListCollaboratorRequest.ts';
import { toUserSlug } from '$lib/utils/profile/toUserSlug.ts';
import {
  combineLatest,
  distinctUntilChanged,
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
  const { notify } = useActionToast();

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
  ]).pipe(map((queries) => queries.some((query) => query.isPending)));

  const candidates = combineLatest([followers, following, collaborators]).pipe(
    map(([followerProfiles, followingProfiles, collaboratorProfiles]) =>
      buildCollaboratorCandidates({
        followers: followerProfiles,
        following: followingProfiles,
        collaborators: collaboratorProfiles,
      })
    ),
  );

  const collaboratorInvalidations = [InvalidateAction.List.Collaborators];

  const add = useMutation(defineMutation({
    key: 'list:add-collaborator',
    request: async (profile: UserProfile) => {
      const { listId } = await firstValueFrom(target$);
      return addListCollaboratorRequest({
        listId,
        userSlug: toUserSlug(profile),
      });
    },
    invalidations: collaboratorInvalidations,
  }));

  const remove = useMutation(defineMutation({
    key: 'list:remove-collaborator',
    request: async (profile: UserProfile) => {
      const { listId } = await firstValueFrom(target$);
      return removeListCollaboratorRequest({
        listId,
        userSlug: toUserSlug(profile),
      });
    },
    invalidations: collaboratorInvalidations,
  }));

  const pendingUserId = combineLatest([add.result, remove.result]).pipe(
    map((results) =>
      results.find((result) => result.isPending)?.variables?.id ?? null
    ),
    distinctUntilChanged(),
  );

  const addCollaborator = async (profile: UserProfile) => {
    const result = await add.mutate(profile);

    if (result === 'limit-reached') {
      notify({
        message: m.action_toast_collaborator_limit_reached(),
        variant: 'error',
      });
    }
  };

  const removeCollaborator = async (profile: UserProfile) => {
    await remove.mutate(profile);
  };

  return {
    candidates,
    isLoading,
    pendingUserId,
    addCollaborator,
    removeCollaborator,
  };
}
