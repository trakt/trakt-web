<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SeasonRecap } from "$lib/requests/models/SeasonRecap.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
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
    <p class="recap-source tag secondary">
      <Link
        href={recap.attribution}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        underline="hover"
      >
        {m.text_recap_source_adapted_wikipedia()}
      </Link>
      <span aria-hidden="true">·</span>
      <Link
        href={UrlBuilder.external.ccBySa4()}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        underline="hover"
      >
        {m.text_recap_source_license()}
      </Link>
    </p>
  {/if}
</div>

<style lang="scss">
  .trakt-recap-tab {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    .recap-source {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-xxs);

      margin: 0;
      margin-top: var(--gap-s);

      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }
</style>
