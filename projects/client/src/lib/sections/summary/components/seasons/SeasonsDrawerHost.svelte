<script lang="ts">
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonDropdown from "$lib/sections/lists/season/SeasonDropdown.svelte";
  import { fade } from "svelte/transition";
  import SeasonDrawerItem from "./_internal/SeasonDrawerItem.svelte";
  import SeasonEpisodesTab from "./SeasonEpisodesTab.svelte";
  import SeasonOverviewTab from "./_internal/SeasonOverviewTab.svelte";
  import SeasonReviewsTab from "./_internal/SeasonReviewsTab.svelte";

  const {
    onClose,
    show,
    seasons,
    currentSeason,
  }: {
    show: ShowEntry;
    seasons: Season[];
    currentSeason: number;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
  let activeTab = $state("episodes");

  const currentSeasonId = $derived(
    seasons.find((s) => s.number === currentSeason)?.id,
  );

  const currentSeasonData = $derived(
    seasons.find((s) => s.number === currentSeason),
  );

  const buildSeasonLink = (seasonNumber: number) => {
    const url = new URL(page.url);
    url.searchParams.set("season", String(seasonNumber));
    return url.toString();
  };
</script>

{#snippet badge()}
  <SeasonDropdown
    showSlug={show.slug}
    {seasons}
    {currentSeason}
    urlBuilder={buildSeasonLink}
  />
{/snippet}

{#snippet episodesIcon()}
  <PlayIcon />
{/snippet}

{#snippet overviewIcon()}
  <InfoIcon />
{/snippet}

{#snippet reviewsIcon()}
  <CommentIcon />
{/snippet}

{#snippet episodesContent()}
  <SeasonEpisodesTab {show} {seasons} {currentSeason} />
{/snippet}

{#snippet overviewContent()}
  {#if currentSeasonData}
    <SeasonOverviewTab {show} season={currentSeasonData} />
  {/if}
{/snippet}

{#snippet reviewsContent()}
  {#if currentSeasonId != null}
    <SeasonReviewsTab
      {show}
      season={currentSeason}
      seasonId={currentSeasonId}
    />
  {/if}
{/snippet}

<Drawer
  {onClose}
  {badge}
  onOpened={() => (isOpen = true)}
  title={m.list_title_seasons()}
  size="large"
>
  {#if isOpen}
    <div class="seasons-drawer-content" transition:fade={{ duration: 150 }}>
      {#if seasons.length > 1}
        <div class="seasons-section">
          <SectionList
            id={{
              scope: "season-poster-list",
              key: show.slug,
            }}
            items={seasons}
            title={null}
            variant="inline"
          >
            {#snippet item(season)}
              <SeasonDrawerItem
                {show}
                {season}
                isCurrentSeason={season.number === currentSeason}
                urlBuilder={() => buildSeasonLink(season.number)}
              />
            {/snippet}
          </SectionList>
        </div>
      {/if}

      <TabView
        value={activeTab}
        onChange={(value) => (activeTab = value)}
        tabs={[
          {
            value: "episodes",
            label: m.tab_text_seasons_episodes(),
            icon: episodesIcon,
            content: episodesContent,
          },
          {
            value: "overview",
            label: m.tab_text_seasons_info(),
            icon: overviewIcon,
            content: overviewContent,
          },
          {
            value: "reviews",
            label: m.tab_text_seasons_reviews(),
            icon: reviewsIcon,
            content: reviewsContent,
          },
        ]}
      />
    </div>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .seasons-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding-bottom: var(--ni-8);

    :global(.trakt-list-item-container) {
      padding-inline: 0;
    }

    :global(.trakt-grid-list-container) {
      overflow-x: visible;
    }
  }

  .seasons-section {
    --column-count: 4;

    --container-width: calc(
      var(--drawer-size) - 2 * var(--drawer-padding) - var(--list-gap)
    );
    --width-override-card: calc(
      (var(--container-width) - (var(--column-count) - 1) * var(--list-gap)) /
        var(--column-count)
    );
    --height-override-card-cover: calc(var(--width-override-card) * 1.5);
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--height-card-footer-sm)
    );

    --height-list: calc(
      var(--height-override-card) + var(--layout-scrollbar-width)
    );

    @include for-mobile {
      --column-count: 3;
      --container-width: calc(
        100dvw - 2 * var(--drawer-padding) - var(--list-gap)
      );
    }
  }
</style>
