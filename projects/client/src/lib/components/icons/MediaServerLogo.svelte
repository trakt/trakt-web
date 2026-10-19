<script lang="ts">
  import type { MediaSyncConnection } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import JellyfinLogo from "./JellyfinLogo.svelte";
  import PlexLogo from "./PlexLogo.svelte";

  const { provider }: { provider: MediaSyncConnection["provider"] } = $props();
</script>

{#if provider === "jellyfin"}
  <JellyfinLogo />
{:else}
  <PlexLogo />
{/if}
