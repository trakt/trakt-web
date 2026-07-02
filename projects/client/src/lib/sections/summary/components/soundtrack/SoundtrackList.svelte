<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { slide } from "svelte/transition";
  import SoundtrackBoard from "./_internal/SoundtrackBoard.svelte";
  import SoundtrackUpsell from "./_internal/SoundtrackUpsell.svelte";
  import { toSoundtrackSummary } from "./_internal/toSoundtrackSummary.ts";
  import { useSoundtrack } from "./useSoundtrack.ts";

  const maxRows = 5;

  const { media }: { media: MediaEntry } = $props();

  const { tracks } = useSoundtrack(
    fromRune(() => ({ slug: media.slug, type: media.type })),
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const visibleTracks = $derived($tracks.slice(0, maxRows));
  const summary = $derived(toSoundtrackSummary($tracks));
  const hasMore = $derived($tracks.length > maxRows);
</script>

{#snippet title(withCaret: boolean)}
  <span class="header-title">
    <h2 class="header-heading">{m.list_title_soundtrack()}</h2>
    {#if withCaret}
      <CaretRightIcon />
    {/if}
  </span>
{/snippet}

{#snippet header(withDrilldown: boolean)}
  <div class="soundtrack-header">
    {#if withDrilldown}
      <Link
        {...buildDrawerLink(SummaryDrawers.Soundtrack)}
        label={m.button_label_view_soundtrack()}
        color="inherit"
        onclick={() => track({ source: "soundtrack" })}
      >
        {@render title(true)}
      </Link>
    {:else}
      {@render title(false)}
    {/if}
  </div>
{/snippet}

<RenderFor audience="vip">
  {#if $tracks.length > 0}
    <section class="trakt-soundtrack-section" transition:slide={{ duration: 150 }}>
      {@render header(hasMore)}
      <SoundtrackBoard
        {media}
        tracks={visibleTracks}
        {summary}
        source="soundtrack-summary"
      />
    </section>
  {/if}
</RenderFor>

<SoundtrackUpsell />

<style lang="scss">
  .trakt-soundtrack-section {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);

    padding-inline: var(--layout-distance-side);
  }

  .soundtrack-header {
    display: flex;
    gap: var(--ni-12);
    align-items: baseline;
  }

  .header-title {
    display: inline-flex;
    gap: var(--ni-4);
    align-items: center;
  }

  .header-heading {
    margin: 0;
  }
</style>
