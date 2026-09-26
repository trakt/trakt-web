import { useQuery } from '$lib/features/query/useQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
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

type LeaveCollaborationTarget = {
  listId: number;
};

export function useLeaveCollaboration(
  target$: Observable<LeaveCollaborationTarget>,
) {
  const { user } = useUser();
  const { invalidate } = useInvalidator();

  const collaboratorsQuery$ = useQuery(
    target$.pipe(map(({ listId }) => listCollaboratorsQuery({ listId }))),
  );

  const isCollaborator = combineLatest([collaboratorsQuery$, user]).pipe(
    map(([query, currentUser]) =>
      (query.data ?? []).some((profile) => profile.id === currentUser.id)
    ),
  );

  const isLeaving = new BehaviorSubject(false);

  const leaveCollaboration = async () => {
    const [{ listId }, currentUser] = await Promise.all([
      firstValueFrom(target$),
      firstValueFrom(user),
    ]);
    const userSlug = toUserSlug(currentUser);

    isLeaving.next(true);
    try {
      await removeListCollaboratorRequest({ listId, userSlug });
      await invalidate(InvalidateAction.List.Collaborators);
    } finally {
      isLeaving.next(false);
    }
  };

  return {
    isCollaborator,
    isLeaving: isLeaving.asObservable(),
    leaveCollaboration,
  };
}
