<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
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

  const visibleTracks = $derived($tracks.slice(0, maxRows));
  const summary = $derived(toSoundtrackSummary($tracks));
  const drilldown = $derived(
    $tracks.length > maxRows
      ? {
          ...buildDrawerLink(SummaryDrawers.Soundtrack),
          label: m.button_label_view_soundtrack(),
          source: { id: "soundtrack" },
        }
      : undefined,
  );
</script>

<RenderFor audience="vip">
  {#if $tracks.length > 0}
    <section class="trakt-soundtrack-section" transition:slide={{ duration: 150 }}>
      <ListHeader title={m.list_title_soundtrack()} {drilldown} />
      <div class="soundtrack-body">
        <SoundtrackBoard
          {media}
          tracks={visibleTracks}
          {summary}
          source="soundtrack-summary"
        />
      </div>
    </section>
  {/if}
</RenderFor>

<SoundtrackUpsell />

<style lang="scss">
  .trakt-soundtrack-section {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .soundtrack-body {
    padding-inline: var(--layout-distance-side);
  }
</style>
