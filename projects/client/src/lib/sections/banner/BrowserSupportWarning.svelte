<script lang="ts">
  import { onMount } from "svelte";
  import { getUnsupportedCssFeatures } from "$lib/utils/devices/getUnsupportedCssFeatures.ts";
  import BannerContainer from "./_internal/BannerContainer.svelte";

  let unsupportedFeatures = $state<ReadonlyArray<string>>([]);

  const hasUnsupportedFeatures = $derived(unsupportedFeatures.length > 0);
  const unsupportedFeatureList = $derived(unsupportedFeatures.join(", "));

  onMount(() => {
    unsupportedFeatures = getUnsupportedCssFeatures();
  });
</script>

{#if hasUnsupportedFeatures}
  <BannerContainer variant="fluid">
    <section class="trakt-browser-support-warning" role="alert" aria-live="polite">
      <p>
        <strong>Browser update recommended.</strong>
        Your browser is missing support for {unsupportedFeatureList}. Some parts of
        Trakt may not work correctly.
      </p>
    </section>
  </BannerContainer>
{/if}

<style>
  .trakt-browser-support-warning {
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);
    margin-top: var(--ni-8);
    padding: var(--ni-12) var(--ni-16);

    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    color: var(--color-foreground);
  }

  .trakt-browser-support-warning p {
    margin: 0;
    font-size: var(--font-size-s);
  }
</style>
