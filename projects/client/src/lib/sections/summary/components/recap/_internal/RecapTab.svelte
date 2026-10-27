<script lang="ts">
  import WikipediaIcon from "$lib/components/icons/WikipediaIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SeasonRecap } from "$lib/requests/models/SeasonRecap.ts";
  import RecapInDepth from "./RecapInDepth.svelte";
  import RecapKeyMoments from "./RecapKeyMoments.svelte";
  import RecapLines from "./RecapLines.svelte";
  import RecapSummary from "./RecapSummary.svelte";

  const { recap }: { recap: SeasonRecap } = $props();
</script>

<div class="trakt-recap-tab">
  <RecapSummary summary={recap.summary} />

  {#if recap.keyPoints.length > 0}
    <RecapKeyMoments points={recap.keyPoints} />
  {/if}

  {#if recap.lines.length > 0}
    <RecapLines lines={recap.lines} caption={m.text_recap_at_the_finale()} />
  {/if}

  <RecapInDepth chapters={recap.chapters} />

  {#if recap.attribution}
    <Link
      href={recap.attribution}
      target="_blank"
      rel="noopener noreferrer"
      label={m.text_recap_source_wikipedia()}
    >
      <span class="recap-source small secondary">
        <WikipediaIcon />
        {m.text_recap_source_wikipedia()}
      </span>
    </Link>
  {/if}
</div>

<style lang="scss">
  .trakt-recap-tab {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    .recap-source {
      display: inline-flex;
      color: var(--color-text-secondary);
      align-items: center;
      gap: var(--gap-xxs);

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }
  }
</style>
