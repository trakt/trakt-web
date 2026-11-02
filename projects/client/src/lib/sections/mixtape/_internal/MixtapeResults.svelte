<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import MixtapeStage from "./MixtapeStage.svelte";

  const { isLoading, ...props }: MixtapeResultsProps = $props();
</script>

{#if isLoading}
  <div class="trakt-mixtape-results-loading">
    <LoadingIndicator />
  </div>
{:else}
  <MixtapeStage {...props} />
{/if}

<style>
  .trakt-mixtape-results-loading {
    display: grid;
    place-items: center;
    min-height: var(--ni-320);
  }
</style>
