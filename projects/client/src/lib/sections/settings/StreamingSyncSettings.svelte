<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import ConnectionResultHandler from "./_internal/streaming-sync/ConnectionResultHandler.svelte";
  import DataSyncs from "./_internal/streaming-sync/DataSyncs.svelte";
  import StreamingConnectionStatusSnackbar from "./_internal/streaming-sync/StreamingConnectionStatusSnackbar.svelte";
  import StreamingServices from "./_internal/streaming-sync/StreamingServices.svelte";
  import StreamingSyncIntro from "./_internal/streaming-sync/StreamingSyncIntro.svelte";
</script>

<RenderForFeature flag={FeatureFlag.StreamingSync}>
  {#snippet enabled()}
    <div class="trakt-streaming-sync-settings">
      <ConnectionResultHandler />
      <StreamingSyncIntro />
      <StreamingConnectionStatusSnackbar />
      <StreamingServices />
      <DataSyncs />
    </div>
  {/snippet}
</RenderForFeature>

<style>
  .trakt-streaming-sync-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
