<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { refreshStreamingRequest } from "$lib/requests/queries/streaming-sync/refreshStreamingRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { onMount } from "svelte";
  import {
    type StreamingConnectionStatusKind,
    streamingConnectionStatus,
  } from "./streamingConnectionStatus.ts";

  // Clean result params the connect callback route redirects here with.
  const CONNECTION_PARAM = "connection";
  const SERVICE_PARAM = "service";

  const RESULT_KINDS = new Set<StreamingConnectionStatusKind>([
    "connected",
    "cancelled",
    "error",
  ]);

  const { invalidate } = useInvalidator();

  function toKind(value: string | null): StreamingConnectionStatusKind | null {
    if (value && RESULT_KINDS.has(value as StreamingConnectionStatusKind)) {
      return value as StreamingConnectionStatusKind;
    }
    return null;
  }

  onMount(async () => {
    const kind = toKind(page.url.searchParams.get(CONNECTION_PARAM));

    if (!kind) {
      return;
    }

    const serviceId = page.url.searchParams.get(SERVICE_PARAM);

    // Strip the result params so a refresh doesn't re-trigger the banner.
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(UrlBuilder.settings.streamingSync(), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });

    streamingConnectionStatus.set({ kind, serviceId });

    // Mirror v2: a fresh connection kicks off a full re-sync of all data.
    if (kind === "connected" && serviceId) {
      await refreshStreamingRequest({ serviceId, allData: true }).catch(() =>
        false
      );
      await invalidate(InvalidateAction.StreamingSync.Connection);
    }
  });
</script>
