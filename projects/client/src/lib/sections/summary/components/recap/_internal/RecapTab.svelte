<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SeasonRecap } from "$lib/requests/models/SeasonRecap.ts";
  import RecapInDepth from "./RecapInDepth.svelte";
  import RecapKeyMoments from "./RecapKeyMoments.svelte";
  import RecapLines from "./RecapLines.svelte";
  import RecapSource from "./RecapSource.svelte";
  import RecapSummary from "./RecapSummary.svelte";

  const { recap }: { recap: SeasonRecap } = $props();
</script>

<div class="trakt-recap-tab">
  <RecapSummary summary={recap.summary} />

  {#if recap.keyPoints.length > 0}
    <RecapKeyMoments
      heading={m.header_recap_key_moments()}
      points={recap.keyPoints}
    />
  {/if}

  {#if recap.lines.length > 0}
    <RecapLines lines={recap.lines} caption={m.text_recap_at_the_finale()} />
  {/if}

  <RecapInDepth chapters={recap.chapters} />

  {#if recap.attribution}
    <RecapSource attribution={recap.attribution} />
  {/if}
</div>

<style lang="scss">
  .trakt-recap-tab {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }
</style>
