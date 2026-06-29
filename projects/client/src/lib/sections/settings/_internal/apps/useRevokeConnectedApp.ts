import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { revokeConnectedAppRequest } from '$lib/requests/queries/apps/revokeConnectedAppRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';

type RevokeTarget = {
  id: number;
  name: string;
};

export function useRevokeConnectedApp() {
  const { invalidate } = useInvalidator();
  const { confirm } = useConfirm();

  const revoke = (app: RevokeTarget) =>
    confirm({
      type: ConfirmationType.RevokeApp,
      name: app.name,
      onConfirm: async () => {
        await revokeConnectedAppRequest({ id: app.id });
        await invalidate(InvalidateAction.App.Revoke);
      },
    });

  return { revoke };
}
