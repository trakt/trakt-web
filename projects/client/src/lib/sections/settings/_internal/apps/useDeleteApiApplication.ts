import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { deleteApiApplicationRequest } from '$lib/requests/queries/apps/deleteApiApplicationRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';

type DeleteTarget = {
  id: number;
  name: string;
};

export function useDeleteApiApplication() {
  const { invalidate } = useInvalidator();
  const { confirm } = useConfirm();

  const remove = (app: DeleteTarget, onDeleted?: () => void) =>
    confirm({
      type: ConfirmationType.DeleteApiApp,
      name: app.name,
      onConfirm: async () => {
        const deleted = await deleteApiApplicationRequest({ id: app.id });

        if (!deleted) {
          return;
        }

        await invalidate(InvalidateAction.App.Delete);
        onDeleted?.();
      },
    });

  return { remove };
}
