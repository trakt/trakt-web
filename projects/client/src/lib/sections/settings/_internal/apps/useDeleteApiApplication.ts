import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { deleteApiApplicationRequest } from '$lib/requests/queries/apps/deleteApiApplicationRequest.ts';

type DeleteTarget = {
  id: number;
  name: string;
};

export function useDeleteApiApplication() {
  const { confirm } = useConfirm();

  const deletion = useMutation(defineMutation({
    key: 'app:delete',
    request: ({ id }: DeleteTarget) => deleteApiApplicationRequest({ id }),
    invalidations: ({ data }) => data ? [InvalidateAction.App.Delete] : [],
  }));

  const remove = (app: DeleteTarget, onDeleted?: () => void) =>
    confirm({
      type: ConfirmationType.DeleteApiApp,
      name: app.name,
      onConfirm: async () => {
        const deleted = await deletion.mutate(app);

        if (!deleted) {
          return;
        }

        onDeleted?.();
      },
    });

  return { remove };
}
