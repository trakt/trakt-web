<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import ConnectionResultHandler from "./_internal/streaming-services/ConnectionResultHandler.svelte";
  import DataSyncs from "./_internal/streaming-services/DataSyncs.svelte";
  import FavoriteServices from "./_internal/streaming-services/FavoriteServices.svelte";
  import StreamingConnectionStatusSnackbar from "./_internal/streaming-services/StreamingConnectionStatusSnackbar.svelte";
  import StreamingServices from "./_internal/streaming-services/StreamingServices.svelte";
  import StreamingServicesIntro from "./_internal/streaming-services/StreamingServicesIntro.svelte";
</script>

<RenderForFeature flag={FeatureFlag.StreamingServices}>
  {#snippet enabled()}
    <div class="trakt-streaming-services-settings">
      <ConnectionResultHandler />
      <FavoriteServices />
      <StreamingServicesIntro />
      <StreamingConnectionStatusSnackbar />
      <StreamingServices />
      <DataSyncs />
    </div>
  {/snippet}
</RenderForFeature>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streaming-services-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    max-width: var(--ni-640);

    @include for-tablet-sm-and-below() {
      max-width: 100%;
    }
  }
</style>
