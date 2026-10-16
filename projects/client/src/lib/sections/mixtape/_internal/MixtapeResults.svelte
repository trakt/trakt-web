<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MixtapeDeck from "./MixtapeDeck.svelte";
  import MixtapeFan from "./MixtapeFan.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";

  const { isLoading, ...props }: MixtapeResultsProps = $props();
</script>

{#if isLoading}
  <div class="trakt-mixtape-results-loading">
    <LoadingIndicator />
  </div>
{:else}
  <RenderFor audience="authenticated" device={["mobile"]}>
    <MixtapeDeck {...props} />
  </RenderFor>
  <RenderFor
    audience="authenticated"
    device={["tablet-sm", "tablet-lg", "desktop"]}
  >
    <MixtapeFan {...props} />
  </RenderFor>
{/if}

<style>
  .trakt-mixtape-results-loading {
    display: grid;
    place-items: center;
    min-height: var(--ni-320);
  }
</style>
