<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import LivingPoster from "$lib/features/living-poster/components/LivingPoster.svelte";
  import type { LivingPosterTarget } from "$lib/features/living-poster/models/LivingPosterTarget";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

  const {
    target,
    onsettledchange,
  }: {
    target: LivingPosterTarget;
    onsettledchange: (isSettled: boolean) => void;
  } = $props();
</script>

<RenderForFeature flag={FeatureFlag.LivingPoster} audience="director">
  {#snippet enabled()}
    <LivingPoster {target} {onsettledchange} />
  {/snippet}
</RenderForFeature>
