<script lang="ts">
  import LiveDot from "$lib/components/live-dot/LiveDot.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import WatchingNowPersonRow from "./_internal/WatchingNowPersonRow.svelte";
  import { useMediaWatching } from "./useMediaWatching.ts";

  const { target }: { target: MediaSocialQueryTarget } = $props();

  const { total, entries } = useMediaWatching(fromRune(() => target));
  const { track } = useTrack(AnalyticsEvent.WatchingNowOpen);

  const peopleLabel = $derived(
    $total === 1
      ? m.text_watching_now_people_one({ count: $total })
      : m.text_watching_now_people_other({ count: $total }),
  );
</script>

{#if $entries.length > 0}
  <section class="trakt-watching-now-social-section">
    <header class="section-header">
      <span class="section-title">
        <LiveDot />
        <p class="secondary small bold">{m.header_watching_now()}</p>
      </span>
      <p class="secondary small bold">{peopleLabel}</p>
    </header>

    <ul class="section-list">
      {#each $entries as entry (entry.key)}
        <WatchingNowPersonRow
          {entry}
          onclick={() => track({ source: "summary" })}
        />
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  .trakt-watching-now-social-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
      padding: 0 var(--gap-s) var(--ni-2);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .section-list {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
</style>
