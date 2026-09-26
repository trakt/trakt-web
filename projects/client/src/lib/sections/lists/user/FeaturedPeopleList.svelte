<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import FeaturedPeopleContent from "./_internal/FeaturedPeopleContent.svelte";

  const { listId }: { listId: number } = $props();
</script>

<RenderForFeature flag={FeatureFlag.FeaturedPeople}>
  {#snippet enabled()}
    <FeaturedPeopleContent {listId} />
  {/snippet}
</RenderForFeature>
