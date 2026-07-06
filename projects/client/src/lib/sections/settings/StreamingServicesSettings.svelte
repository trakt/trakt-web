<script lang="ts">
  import ConnectionResultHandler from "./_internal/streaming-services/ConnectionResultHandler.svelte";
  import DataSyncs from "./_internal/streaming-services/DataSyncs.svelte";
  import FavoriteServices from "./_internal/streaming-services/FavoriteServices.svelte";
  import StreamingConnectionStatusSnackbar from "./_internal/streaming-services/StreamingConnectionStatusSnackbar.svelte";
  import StreamingServices from "./_internal/streaming-services/StreamingServices.svelte";
  import StreamingServicesIntro from "./_internal/streaming-services/StreamingServicesIntro.svelte";
</script>

<div class="trakt-streaming-services-settings">
  <ConnectionResultHandler />
  <FavoriteServices />
  <StreamingServicesIntro />
  <StreamingConnectionStatusSnackbar />
  <StreamingServices />
  <DataSyncs />
</div>

<style lang="scss">
  .trakt-streaming-services-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
