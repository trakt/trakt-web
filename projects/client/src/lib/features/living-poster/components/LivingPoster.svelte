<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { loadLivingPoster } from "../_internal/loadLivingPoster";
  import type { LivingPosterTarget } from "../models/LivingPosterTarget";
  import LivingPosterStage from "./_internal/LivingPosterStage.svelte";

  const {
    target,
    onsettledchange,
  }: {
    target: LivingPosterTarget;
    onsettledchange?: (isSettled: boolean) => void;
  } = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const type = $derived(target.type);
  const id = $derived(target.id);

  const poster = $derived(
    $isReducedMotion ? Promise.resolve(null) : loadLivingPoster({ type, id }),
  );
</script>

{#await poster then living}
  {#if living}
    <LivingPosterStage poster={living} {onsettledchange} />
  {/if}
{/await}
