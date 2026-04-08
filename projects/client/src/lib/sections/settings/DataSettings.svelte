<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import RawExport from "./_internal/RawExport.svelte";
  import RawImport from "./_internal/RawImport.svelte";
</script>

<div class="trakt-data-settings">
  <RenderForFeature flag={FeatureFlag.DataImport}>
    {#snippet enabled()}
      <RawImport />
    {/snippet}
  </RenderForFeature>
  <RawExport />
</div>

<style>
  .trakt-data-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    max-width: var(--ni-920);
  }
</style>
