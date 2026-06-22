<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { saveStreamingPreferencesRequest } from "$lib/requests/queries/services/saveStreamingPreferencesRequest.ts";
  import { refreshStreamingRequest } from "$lib/requests/queries/streaming-sync/refreshStreamingRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { firstValueFrom } from "rxjs";
  import { onMount } from "svelte";
  import { toFavoritesWithConnection } from "./toFavoritesWithConnection.ts";
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
  const { favorites, country } = useStreamingPreferences();

  function toKind(value: string | null): StreamingConnectionStatusKind | null {
    if (value && RESULT_KINDS.has(value as StreamingConnectionStatusKind)) {
      return value as StreamingConnectionStatusKind;
    }
    return null;
  }

  // Mark the connected service as a watch-now favorite, mapping the younify id
  // onto its source slug. Best-effort: a failure must not block the re-sync.
  async function addConnectedFavorite(serviceId: string) {
    const [currentFavorites, countryCode] = await Promise.all([
      firstValueFrom(favorites),
      firstValueFrom(country),
    ]);

    const nextFavorites = toFavoritesWithConnection({
      serviceId,
      country: countryCode,
      favorites: currentFavorites,
    });

    if (!nextFavorites) {
      return;
    }

    await saveStreamingPreferencesRequest({ favorites: nextFavorites });
    await invalidate(InvalidateAction.User.Settings);
  }

  onMount(async () => {
    const kind = toKind(page.url.searchParams.get(CONNECTION_PARAM));

    if (!kind) {
      return;
    }

    const serviceId = page.url.searchParams.get(SERVICE_PARAM);

    // Strip the result params so a refresh doesn't re-trigger the banner.
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(UrlBuilder.settings.streamingServices(), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });

    streamingConnectionStatus.set({ kind, serviceId });

    if (kind === "connected" && serviceId) {
      await addConnectedFavorite(serviceId).catch(() => {});

      // Mirror v2: a fresh connection kicks off a full re-sync of all data.
      await refreshStreamingRequest({ serviceId, allData: true }).catch(() =>
        false
      );
      await invalidate(InvalidateAction.StreamingSync.Connection);
    }
  });
</script>
