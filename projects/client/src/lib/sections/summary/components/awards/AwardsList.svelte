<script lang="ts">
  import ListHeader from "$lib/components/lists/ListHeader.svelte";
  import ListCollapseButton from "$lib/components/lists/section-list/ListCollapseButton.svelte";
  import { useCollapsedList } from "$lib/components/lists/section-list/useCollapsedList";
  import { slide } from "svelte/transition";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { ListDrilldownProps } from "$lib/components/lists/section-list/models/ListDrilldownProps";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import AwardCard from "./_internal/AwardCard.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import AwardSummaryLine from "./_internal/AwardSummaryLine.svelte";
  import AwardSpotlights from "./_internal/AwardSpotlights.svelte";
  import AwardsLiveLine from "./_internal/AwardsLiveLine.svelte";
  import { toAwardLiveText } from "./_internal/toAwardLiveText.ts";
  import { toAwardSummary } from "./_internal/toAwardSummary.ts";
  import { useAwards } from "./useAwards.ts";

  const RAIL_LIMIT = 12;
  const SPOTLIGHT_LIMIT = 3;

  const { type, slug }: { type: "movie" | "show"; slug: string } = $props();

  const { awards, groups, isLoading } = useAwards(
    fromRune(() => ({ type, slug })),
  );

  const today = new Date();
  const entries = $derived($awards ?? []);
  const summaryTallies = $derived(toAwardSummary($groups));
  const hasSummary = $derived(summaryTallies.length > 0 && entries.length > 1);
  const liveText = $derived(toAwardLiveText({ groups: $groups, today }));
  const railEntries = $derived(entries.slice(0, RAIL_LIMIT));
  const hiddenCount = $derived(entries.length - railEntries.length);
  const isSpotlight = $derived(
    entries.length > 0 && entries.length <= SPOTLIGHT_LIMIT,
  );

  const { isCollapsed: isListCollapsed, toggle } = $derived(
    useCollapsedList(`awards-list-${type}-${slug}`),
  );
  const isCollapsed = $derived($isListCollapsed);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Awards));
  const drilldown: ListDrilldownProps = $derived({
    ...drawerLink,
    source: { id: "awards" },
    label: m.button_text_view_all(),
  });
</script>

{#snippet titleAction()}
  <ListCollapseButton
    title={m.list_title_awards()}
    {isCollapsed}
    onclick={toggle}
  />
{/snippet}

{#snippet metaInfo()}
  <ListMetaInfo>
    <AwardSummaryLine tallies={summaryTallies} isSingleLine />
  </ListMetaInfo>
{/snippet}

{#snippet liveLine()}
  <AwardsLiveLine text={liveText ?? ""} />
{/snippet}

{#if isSpotlight}
  <section class="trakt-awards-list">
    <ListHeader
      title={m.list_title_awards()}
      {titleAction}
      metaInfo={hasSummary ? metaInfo : undefined}
      titleBadge={liveText && !isCollapsed ? liveLine : undefined}
      drilldown={isCollapsed ? undefined : drilldown}
    />
    {#if !isCollapsed}
      <div transition:slide={{ duration: 150 }}>
        <AwardSpotlights {entries} {today} />
      </div>
    {/if}
  </section>
{:else if $isLoading || entries.length > 0}
  <SectionList
    id={{ scope: `awards-list-${type}`, key: slug }}
    items={railEntries}
    title={m.list_title_awards()}
    metaInfo={hasSummary ? metaInfo : undefined}
    titleBadge={liveText ? liveLine : undefined}
    {drilldown}
    --height-list="calc(var(--height-person-list) + var(--ni-14))"
  >
    {#snippet item(entry)}
      <AwardCard {entry} />
    {/snippet}

    {#snippet trailingItem()}
      {#if hiddenCount > 0}
        <Link
          href={drawerLink.href}
          noscroll={drawerLink.noscroll}
          replacestate={drawerLink.replacestate}
          color="inherit"
          underline="none"
        >
          <span class="awards-see-all">
            <span class="see-all-count bold">+{hiddenCount}</span>
            <span class="see-all-label small secondary">
              {m.text_award_see_all({ count: entries.length })}
            </span>
          </span>
        </Link>
      {/if}
    {/snippet}

    {#snippet empty()}
      {#if $isLoading}
        <SkeletonList id={`awards-list-${type}`} />
      {/if}
    {/snippet}
  </SectionList>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-awards-list {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .awards-see-all {
    display: grid;
    place-items: center;
    align-content: center;
    gap: var(--ni-6);

    width: var(--width-person-card);
    height: var(--height-person-card-cover);

    .see-all-count {
      display: grid;
      place-items: center;

      width: var(--ni-48);
      height: var(--ni-48);
      border-radius: 50%;

      background: var(--background-award-chip-live);
      box-shadow: var(--shadow-award-chip-live);
      color: var(--color-text-primary);

      transition: var(--transition-increment) ease-in-out;
      transition-property: scale, background-color, box-shadow;
    }

    .see-all-label {
      transition: color var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      :global(.trakt-link:hover) &,
      :global(.trakt-link:focus-visible) & {
        .see-all-count {
          scale: 1.08;
          box-shadow:
            var(--shadow-award-chip-live),
            0 0 0 var(--border-thickness-xs) var(--color-link-active);
        }

        .see-all-label {
          color: var(--color-text-primary);
        }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .see-all-count {
        transition-property: background-color, box-shadow;
      }
    }
  }
</style>
