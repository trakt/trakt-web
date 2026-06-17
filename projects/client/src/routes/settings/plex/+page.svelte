<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PlexSettings from "$lib/sections/settings/PlexSettings.svelte";
</script>

<RenderForFeature flag={FeatureFlag.PlexSync}>
  {#snippet enabled()}
    <PlexSettings />
  {/snippet}
</RenderForFeature>
