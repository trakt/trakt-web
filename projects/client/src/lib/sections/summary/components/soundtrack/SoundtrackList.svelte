<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
  import ListCollapseButton from "$lib/components/lists/section-list/ListCollapseButton.svelte";
  import type { ListDrilldownProps } from "$lib/components/lists/section-list/models/ListDrilldownProps";
  import { useCollapsedList } from "$lib/components/lists/section-list/useCollapsedList";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { Snippet } from "svelte";
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
  const drilldown: ListDrilldownProps = $derived({
    ...buildDrawerLink(SummaryDrawers.Soundtrack),
    source: { id: "soundtrack" },
    label: m.button_label_view_soundtrack(),
  });

  const { isCollapsed: isListCollapsed, toggle } = $derived(
    useCollapsedList(`soundtrack-list-${media.type}-${media.slug}`),
  );
  const isCollapsed = $derived($isListCollapsed);

  const visibleTracks = $derived($tracks.slice(0, maxRows));
  const summary = $derived(toSoundtrackSummary($tracks));
  const hasMore = $derived($tracks.length > maxRows);
</script>

{#snippet titleAction()}
  <ListCollapseButton
    title={m.list_title_soundtrack()}
    {isCollapsed}
    onclick={toggle}
  />
{/snippet}

{#snippet upsell()}
  <SoundtrackUpsell />
{/snippet}

{#snippet board()}
  <SoundtrackBoard
    {media}
    tracks={visibleTracks}
    {summary}
    source="soundtrack-summary"
  />
{/snippet}

{#snippet soundtrackSection(
  content: Snippet,
  sectionDrilldown?: ListDrilldownProps,
)}
  <section
    class="trakt-soundtrack-section"
    transition:slide={{ duration: 150 }}
  >
    <ListHeader
      title={m.list_title_soundtrack()}
      {titleAction}
      drilldown={isCollapsed ? undefined : sectionDrilldown}
    />
    {#if !isCollapsed}
      <div class="soundtrack-content" transition:slide={{ duration: 150 }}>
        {@render content()}
      </div>
    {/if}
  </section>
{/snippet}

<RenderFor audience="vip">
  {#if $tracks.length > 0}
    {@render soundtrackSection(board, hasMore ? drilldown : undefined)}
  {/if}
</RenderFor>

<!-- `free` is signed-in non-VIP, `public` is signed out. The endpoint returns
     an empty list for both, so neither may be shown a section that reads as
     "this title has no soundtrack". -->
<RenderFor audience="free">
  {@render soundtrackSection(upsell)}
</RenderFor>

<RenderFor audience="public">
  {@render soundtrackSection(upsell)}
</RenderFor>

<style lang="scss">
  .trakt-soundtrack-section {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .soundtrack-content {
    padding-inline: var(--layout-distance-side);
  }
</style>
