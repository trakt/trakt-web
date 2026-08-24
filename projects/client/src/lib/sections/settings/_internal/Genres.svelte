<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import GenreSlots from "./GenreSlots.svelte";
  import GenreTags from "./GenreTags.svelte";
</script>

<RenderForFeature flag={FeatureFlag.GenrePicker}>
  {#snippet enabled()}
    <GenreSlots />
  {/snippet}
  <GenreTags />
</RenderForFeature>
