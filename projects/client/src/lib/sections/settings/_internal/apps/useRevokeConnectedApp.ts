import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { revokeConnectedAppRequest } from '$lib/requests/queries/apps/revokeConnectedAppRequest.ts';

type RevokeTarget = {
  id: number;
  name: string;
};

export function useRevokeConnectedApp() {
  const { confirm } = useConfirm();

  const revocation = useMutation(defineMutation({
    key: 'app:revoke',
    request: ({ id }: RevokeTarget) => revokeConnectedAppRequest({ id }),
    invalidations: [InvalidateAction.App.Revoke],
  }));

  const revoke = (app: RevokeTarget) =>
    confirm({
      type: ConfirmationType.RevokeApp,
      name: app.name,
      onConfirm: () => revocation.mutate(app),
    });

  return { revoke };
}
