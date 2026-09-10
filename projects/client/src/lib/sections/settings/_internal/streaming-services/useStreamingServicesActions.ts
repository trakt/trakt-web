import { page } from '$app/state';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { connectStreamingRequest } from '$lib/requests/queries/streaming-sync/connectStreamingRequest.ts';
import { disconnectStreamingRequest } from '$lib/requests/queries/streaming-sync/disconnectStreamingRequest.ts';
import { refreshStreamingRequest } from '$lib/requests/queries/streaming-sync/refreshStreamingRequest.ts';
import { undoSyncRequest } from '$lib/requests/queries/streaming-sync/undoSyncRequest.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { streamingConnectionStatus } from './streamingConnectionStatus.ts';

export function useStreamingServicesActions() {
  const { confirm } = useConfirm();

  const refresh = useMutation(defineMutation({
    key: 'streaming:refresh',
    request: (
      { serviceId, allData }: { serviceId: string; allData: boolean },
    ) => refreshStreamingRequest({ serviceId, allData }),
    invalidations: [InvalidateAction.StreamingSync.Connection],
  }));

  const disconnect = useMutation(defineMutation({
    key: 'streaming:disconnect',
    request: (serviceId: string) => disconnectStreamingRequest({ serviceId }),
    invalidations: [InvalidateAction.StreamingSync.Connection],
  }));

  const undoSync = useMutation(defineMutation({
    key: 'streaming:undo-sync',
    request: (syncId: number) => undoSyncRequest({ syncId }),
    invalidations: [InvalidateAction.StreamingSync.Sync],
  }));

  // Younify returns to the dedicated callback route, which normalises its
  // result params before redirecting back to the settings page.
  const buildReturnUrl = () =>
    new URL(UrlBuilder.settings.streamingServicesCallback(), page.url.origin)
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
    await refresh.mutate({ serviceId, allData });
  };

  const unlink = (service: { id: string; name: string }) =>
    confirm({
      type: ConfirmationType.UnlinkStreaming,
      service: service.name,
      onConfirm: () => disconnect.mutate(service.id),
    });

  const undo = (syncId: number) =>
    confirm({
      type: ConfirmationType.UndoSync,
      onConfirm: () => undoSync.mutate(syncId),
    });

  return { connect, sync, unlink, undo };
}
