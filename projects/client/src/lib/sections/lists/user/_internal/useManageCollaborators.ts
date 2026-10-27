import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
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
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
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
  listName: string;
  ownerSlug: string;
};

export function useManageCollaborators(
  target$: Observable<ManageCollaboratorsTarget>,
) {
  const { notify } = useActionToast();
  const { track } = useTrack(AnalyticsEvent.ListCollaborator);

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
      }),
    ),
  );

  const collaboratorInvalidations = [InvalidateAction.List.Collaborators];

  const add = useMutation(
    defineMutation({
      key: 'list:add-collaborator',
      request: async (profile: UserProfile) => {
        const { listId } = await firstValueFrom(target$);
        return addListCollaboratorRequest({
          listId,
          userSlug: toUserSlug(profile),
        });
      },
      invalidations: collaboratorInvalidations,
    }),
  );

  const remove = useMutation(
    defineMutation({
      key: 'list:remove-collaborator',
      request: async (profile: UserProfile) => {
        const { listId } = await firstValueFrom(target$);
        return removeListCollaboratorRequest({
          listId,
          userSlug: toUserSlug(profile),
        });
      },
      invalidations: collaboratorInvalidations,
    }),
  );

  const pendingUserId = combineLatest([add.result, remove.result]).pipe(
    map(
      (results) =>
        results.find((result) => result.isPending)?.variables?.id ?? null,
    ),
    distinctUntilChanged(),
  );

  const notifyMoved = ({
    listName,
    type,
  }: {
    listName: string;
    type: 'personal' | 'shared';
  }) => {
    const isShared = type === 'shared';

    notify({
      message: isShared
        ? m.action_toast_list_moved_to_shared({ title: listName })
        : m.action_toast_list_moved_to_personal({ title: listName }),
      action: {
        text: m.action_toast_action_view_lists(),
        label: isShared
          ? m.action_toast_label_view_shared_lists()
          : m.action_toast_label_view_personal_lists(),
        onAction: () => {
          track({ action: 'view-moved' });
          return goto(UrlBuilder.lists.all('me', type));
        },
      },
    });
  };

  const addCollaborator = async (profile: UserProfile) => {
    const { listName } = await firstValueFrom(target$);
    const previous = await firstValueFrom(collaborators);
    const result = await add.mutate(profile);

    if (result === 'added') {
      track({ action: 'add' });
    }

    if (result === 'added' && previous.length === 0) {
      notifyMoved({ listName, type: 'shared' });
    }

    if (result === 'limit-reached') {
      track({ action: 'limit-reached' });
      notify({
        message: m.action_toast_collaborator_limit_reached(),
        variant: 'error',
      });
    }
  };

  const removeCollaborator = async (profile: UserProfile) => {
    const { listName } = await firstValueFrom(target$);
    const previous = await firstValueFrom(collaborators);
    const isRemoved = await remove.mutate(profile);

    if (isRemoved) {
      track({ action: 'remove' });
    }

    if (isRemoved && previous.length === 1) {
      notifyMoved({ listName, type: 'personal' });
    }
  };

  return {
    candidates,
    isLoading,
    pendingUserId,
    addCollaborator,
    removeCollaborator,
  };
}
