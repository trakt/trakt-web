import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { removeListCollaboratorRequest } from '$lib/requests/queries/users/removeListCollaboratorRequest.ts';
import { toUserSlug } from '$lib/utils/profile/toUserSlug.ts';
import { firstValueFrom, type Observable } from 'rxjs';

type LeaveCollaborationTarget = {
  listId: number;
};

export function useLeaveCollaboration(
  target$: Observable<LeaveCollaborationTarget>,
) {
  const { user } = useUser();

  const leave = useMutation(defineMutation({
    key: 'list:leave-collaboration',
    request: async () => {
      const [{ listId }, currentUser] = await Promise.all([
        firstValueFrom(target$),
        firstValueFrom(user),
      ]);

      return removeListCollaboratorRequest({
        listId,
        userSlug: toUserSlug(currentUser),
      });
    },
    invalidations: [InvalidateAction.List.Collaborators],
  }));

  const leaveCollaboration = async () => {
    await leave.mutate();
  };

  return {
    isLeaving: leave.isPending,
    leaveCollaboration,
  };
}
