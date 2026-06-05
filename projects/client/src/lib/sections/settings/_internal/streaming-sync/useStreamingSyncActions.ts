import { page } from '$app/state';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { connectStreamingRequest } from '$lib/requests/queries/streaming-sync/connectStreamingRequest.ts';
import { disconnectStreamingRequest } from '$lib/requests/queries/streaming-sync/disconnectStreamingRequest.ts';
import { refreshStreamingRequest } from '$lib/requests/queries/streaming-sync/refreshStreamingRequest.ts';
import { undoSyncRequest } from '$lib/requests/queries/streaming-sync/undoSyncRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { streamingConnectionStatus } from './streamingConnectionStatus.ts';

export function useStreamingSyncActions() {
  const { invalidate } = useInvalidator();
  const { confirm } = useConfirm();

  // Younify returns to the dedicated callback route with `yc_status` /
  // `yc_serviceId` appended; that route applies the result, then redirects
  // back to the settings page.
  const buildReturnUrl = () =>
    new URL(UrlBuilder.settings.streamingSyncCallback(), page.url.origin)
      .toString();

  const connect = async (serviceId: string) => {
    const url = await connectStreamingRequest({
      serviceId,
      returnUrl: buildReturnUrl(),
    });

    if (url) {
      globalThis.location.href = url;
      return;
    }

    // The mint was rejected (e.g. not connectable, invalid return url).
    streamingConnectionStatus.set({ kind: 'error', serviceId });
  };

  const sync = async (serviceId: string, allData = false) => {
    await refreshStreamingRequest({ serviceId, allData });
    await invalidate(InvalidateAction.StreamingSync.Connection);
  };

  const unlink = (service: { id: string; name: string }) =>
    confirm({
      type: ConfirmationType.UnlinkStreaming,
      service: service.name,
      onConfirm: async () => {
        await disconnectStreamingRequest({ serviceId: service.id });
        await invalidate(InvalidateAction.StreamingSync.Connection);
      },
    });

  const undo = (syncId: number) =>
    confirm({
      type: ConfirmationType.UndoSync,
      onConfirm: async () => {
        await undoSyncRequest({ syncId });
        await invalidate(InvalidateAction.StreamingSync.Sync);
      },
    });

  return { connect, sync, unlink, undo };
}
