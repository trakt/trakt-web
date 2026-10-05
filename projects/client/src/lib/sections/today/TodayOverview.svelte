<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { getDayRange } from "./_internal/getDayRange.ts";
  import { toActivityRanges } from "./_internal/toActivityRanges.ts";
  import { pickHeroStory } from "./_internal/pickHeroStory.ts";
  import TodayFeedEntry from "./_internal/TodayFeedEntry.svelte";
  import TodayFeed from "./_internal/TodayFeed.svelte";
  import TodayGroupingDropdown from "./_internal/TodayGroupingDropdown.svelte";
  import TodayForYouRow from "./_internal/TodayForYouRow.svelte";
  import TodayHero from "./_internal/TodayHero.svelte";
  import TodayMasthead from "./_internal/TodayMasthead.svelte";
  import TodayHeroSkeleton from "./_internal/TodayHeroSkeleton.svelte";
  import TodayMostActive from "./_internal/TodayMostActive.svelte";
  import TodayMostActiveSkeleton from "./_internal/TodayMostActiveSkeleton.svelte";
  import { todayOverviewParams } from "./_internal/todayOverviewParams.ts";
  import TodayPersonDrawer from "./_internal/TodayPersonDrawer.svelte";
  import TodayPersonTile from "./_internal/TodayPersonTile.svelte";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import TodayTitleDrawer from "./_internal/TodayTitleDrawer.svelte";
  import TodayTitleTile from "./_internal/TodayTitleTile.svelte";
  import { toFeedSections } from "./_internal/toFeedSections.ts";
  import { toHighlights } from "./_internal/toHighlights.ts";
  import { toPersonActions } from "./_internal/toPersonActions.ts";
  import { toPersonGroups } from "./_internal/toPersonGroups.ts";
  import { toTodayDays } from "./_internal/toTodayDays.ts";
  import { toTodayStories } from "./_internal/toTodayStories.ts";
  import { useTodayDayCounts } from "./useTodayDayCounts.ts";
  import { useTodayStories } from "./useTodayStories.ts";
  import type { Snippet } from "svelte";

  const QUIET_ACTION_COUNT = 4;
  const CARD_SKELETON_COUNT = 6;

  const { filterMap } = useFilter();
  const params = $derived(todayOverviewParams(page.url.searchParams));
  const dayKey = $derived(params.day);
  const now = new Date();
  const dayRange = $derived(getDayRange({ dayKey, now }));
  const range = fromRune(() => dayRange);
  const ranges = fromRune(() => toActivityRanges({ dayKey, now }));

  const { activities, forYou, isLoading } = $derived(
    useTodayStories({ type: "media", filter: $filterMap, range, ranges }),
  );

  const { storyLink } = todayStoryNavigation();

  let openKey: string | null = $state(null);

  const stories = $derived(
    toTodayStories({
      activities: $activities ?? [],
      forYou: $forYou ?? [],
    }),
  );
  const titles = $derived(stories.titles);
  const personGroups = $derived(toPersonGroups(titles));
  const firstStory = $derived(stories.groups.at(0));
  const playAllLink = $derived(
    firstStory ? storyLink(firstStory.key) : null,
  );
  const hero = $derived(pickHeroStory(titles));

  const actions = $derived(toPersonActions(titles));
  const nonHeroActions = $derived(
    actions.filter((action) => action.media.key !== hero?.key),
  );
  const highlights = $derived(toHighlights(nonHeroActions));
  const highlightCards = $derived(
    [highlights.comment, highlights.rating].filter((action) => action != null),
  );
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const featuredCards = $derived($isMobile ? [] : highlightCards);
  const feedSections = $derived(
    toFeedSections(
      nonHeroActions.filter((action) =>
        !featuredCards.some((card) => card.key === action.key)
      ),
    ),
  );
  const hasNoStories = $derived(
    titles.length === 0 && stories.forYou.length === 0,
  );
  const isFirstLoad = $derived($isLoading && hasNoStories);
  const isEmpty = $derived(!$isLoading && hasNoStories);

  const days = toTodayDays(now);
  const dayCounts = useTodayDayCounts({ days, now });
  const selectedDay = $derived(
    days.find((day) => day.key === params.day) ?? days.at(0),
  );
  const yesterday = days.at(1);
  const isQuiet = $derived(
    !$isLoading &&
      selectedDay?.isToday === true &&
      actions.length > 0 &&
      actions.length < QUIET_ACTION_COUNT,
  );

  const summary = $derived.by(() => {
    if ($isLoading || actions.length === 0) return null;

    const activities =
      actions.length === 1
        ? m.text_today_activities_one()
        : m.text_today_activities_other({ count: actions.length });
    const people =
      personGroups.length === 1
        ? m.text_today_people_one()
        : m.text_today_people_other({ count: personGroups.length });

    return m.text_today_summary({ activities, people });
  });

  const openStory = $derived(titles.find((story) => story.key === openKey));
  const openPerson = $derived(
    personGroups.find((group) => group.key === openKey),
  );

  const open = (key: string) => {
    openKey = key;
  };
  const close = () => {
    openKey = null;
  };
</script>

{#snippet heading(text: string, count?: number, end?: Snippet)}
  <div class="overview-heading-row">
    <h3 class="overview-heading">
      {text}
      {#if count}
        <span class="tag bold overview-count">{count}</span>
      {/if}
    </h3>
    {#if end}
      <div class="heading-end">{@render end()}</div>
    {/if}
  </div>
{/snippet}

{#snippet playAll()}
  {#if playAllLink}
    <Button
      href={playAllLink.href}
      noscroll={playAllLink.noscroll}
      replacestate={playAllLink.replacestate}
      label={m.button_label_play_all_stories()}
      size="small"
      style="ghost"
      color="purple"
    >
      {m.button_text_play_all_stories()}
      {#snippet icon()}
        <PlayIcon size="small" />
      {/snippet}
    </Button>
  {/if}
{/snippet}

{#snippet grouping()}
  <TodayGroupingDropdown
    value={params.grouping}
    onChange={params.setGrouping}
  />
{/snippet}

{#snippet friendsEnd()}
  {#if !hero}
    {@render playAll()}
  {/if}
  {@render grouping()}
{/snippet}

<div class="trakt-today-overview">
  <TodayMasthead
    {days}
    {selectedDay}
    range={dayRange}
    counts={$dayCounts}
    {summary}
    isLoading={$isLoading}
    onChange={params.setDay}
  />

  <div class="overview-body" class:is-loading={$isLoading && !isFirstLoad}>
    {#if isFirstLoad}
      <section class="overview-column overview-spotlight" aria-hidden="true">
        {@render heading(m.text_today_top_story())}
        <TodayHeroSkeleton />
      </section>

      <div class="overview-column overview-main" aria-hidden="true">
        {@render heading(m.text_today_from_friends(), undefined, grouping)}
        <div class="overview-cards">
          {#each Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => index) as card (card)}
            <div class="card-skeleton">
              <Skeleton
                height="var(--height-override-card-cover)"
                radius="var(--border-radius-m)"
              />
              <Skeleton width="70%" height="var(--ni-14)" />
              <Skeleton width="45%" height="var(--ni-12)" />
            </div>
          {/each}
        </div>
      </div>

      <aside class="overview-column overview-rail" aria-hidden="true">
        {@render heading(m.text_today_most_active())}
        <TodayMostActiveSkeleton />
      </aside>
    {:else}
    {#if hero || stories.forYou.length > 0}
      <section class="overview-column overview-spotlight">
        {#if hero}
          {@render heading(m.text_today_top_story(), undefined, playAll)}
          <TodayHero story={hero} />

          <div class="spotlight-highlights">
            {#each highlightCards as action (action.key)}
              <TodayFeedEntry {action} />
            {/each}
          </div>
        {/if}

        {#if stories.forYou.length > 0}
          <div class="spotlight-for-you">
            {@render heading(
              m.text_today_for_you(),
              stories.forYou.length,
              !hero && titles.length === 0 ? playAll : undefined,
            )}
            {#each stories.forYou as item (item.key)}
              <TodayForYouRow {item} />
            {/each}
          </div>
        {/if}
      </section>
    {/if}

    <div class="overview-column overview-main">
      {#if titles.length > 0}
        {@render heading(
          m.text_today_from_friends(),
          params.grouping === "person" ? personGroups.length : titles.length,
          friendsEnd,
        )}
        {#if params.grouping === "time"}
          <TodayFeed sections={feedSections} {now} />
        {:else}
          <div class="overview-cards">
            {#if params.grouping === "title"}
              {#each titles as story (story.key)}
                <TodayTitleTile {story} onOpen={() => open(story.key)} />
              {/each}
            {:else}
              {#each personGroups as group (group.key)}
                <TodayPersonTile {group} onOpen={() => open(group.key)} />
              {/each}
            {/if}
          </div>
        {/if}
      {/if}

      {#if isQuiet && yesterday}
        <div class="overview-quiet">
          <p class="secondary">{m.text_today_caught_up()}</p>
          <Button
            label={m.button_text_today_see_yesterday()}
            onclick={() => params.setDay(yesterday.key)}
            size="small"
          >
            {m.button_text_today_see_yesterday()}
          </Button>
        </div>
      {/if}

      {#if isEmpty}
        <p class="secondary">
          {selectedDay?.isToday === false
            ? m.text_today_empty_day()
            : m.text_today_empty()}
        </p>
      {/if}
    </div>

    <aside class="overview-column overview-rail">
      {#if personGroups.length > 0}
        {@render heading(m.text_today_most_active())}
        <TodayMostActive groups={personGroups} onOpen={open} />
      {/if}
    </aside>
    {/if}
  </div>
</div>

{#if openStory}
  <TodayTitleDrawer story={openStory} onClose={close} />
{/if}

{#if openPerson}
  <TodayPersonDrawer group={openPerson} onClose={close} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-overview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    box-sizing: border-box;
    width: 100%;
    max-width: var(--ni-1920);
    margin-inline: auto;
    padding-inline: var(--layout-distance-side);

    h3 {
      margin: 0;
    }

    .overview-heading {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .overview-count {
      min-width: var(--ni-20);
      padding: var(--ni-2) var(--ni-6);
      box-sizing: border-box;

      border-radius: var(--border-radius-xxl);
      background: color-mix(in srgb, var(--purple-500) 16%, transparent);
      color: var(--color-text-emphasis);
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .card-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
      height: var(--height-override-card);
    }

    .overview-heading-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
      min-height: var(--ni-40);

      .overview-heading {
        min-width: 0;
      }
    }

    .heading-end {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .overview-body {
      --overview-column-gap: var(--gap-xl);

      display: flex;
      flex-direction: column;
      gap: var(--gap-l);

      transition: opacity var(--transition-increment) ease-out;

      &.is-loading {
        opacity: 0.5;
        pointer-events: none;
      }

      @include for-tablet-sm {
        display: grid;
        column-gap: var(--overview-column-gap);
        grid-template-columns: minmax(var(--ni-280), 1fr) minmax(0, 2fr);
        align-items: start;
      }

      @include for-tablet-lg {
        display: grid;
        column-gap: var(--overview-column-gap);
        grid-template-columns: minmax(var(--ni-280), 1fr) minmax(0, 2fr);
        align-items: start;
      }

      @include for-desktop {
        display: grid;
        column-gap: var(--overview-column-gap);
        grid-template-columns:
          minmax(var(--ni-280), min(30%, var(--ni-480)))
          minmax(0, 1fr)
          minmax(var(--ni-240), min(20%, var(--ni-320)));
        align-items: start;
      }
    }

    .overview-column {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      min-width: 0;
    }

    .overview-main {
      --splitter-top: calc(var(--ni-40) + var(--gap-s));
      --splitter-color: color-mix(
        in srgb,
        var(--purple-400) 45%,
        var(--color-foreground) 10%
      );

      position: relative;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: var(--splitter-top);
        width: var(--border-thickness-xxs);
        height: min(calc(100% - var(--splitter-top)), var(--ni-640));

        pointer-events: none;
        background: linear-gradient(
          180deg,
          transparent,
          var(--splitter-color) var(--ni-48),
          color-mix(in srgb, var(--splitter-color) 40%, transparent) 55%,
          transparent
        );
      }

      &::before {
        inset-inline-start: calc(-0.5 * var(--overview-column-gap));
      }

      &::after {
        display: none;
        inset-inline-end: calc(-0.5 * var(--overview-column-gap));
      }

      @include for-mobile {
        &::before {
          display: none;
        }
      }

      @include for-desktop {
        &::after {
          display: block;
        }
      }
    }

    .overview-spotlight,
    .overview-main {
      @include for-tablet-sm {
        grid-row: 1;
      }

      @include for-tablet-lg {
        grid-row: 1;
      }

      @include for-desktop {
        grid-row: 1;
      }
    }

    .overview-main {
      container: today-cards / inline-size;

      @include for-tablet-sm {
        grid-column: 2;
      }

      @include for-tablet-lg {
        grid-column: 2;
      }

      @include for-desktop {
        grid-column: 2;
      }
    }

    .spotlight-highlights,
    .spotlight-for-you {
      display: flex;
      flex-direction: column;
      margin-top: var(--gap-s);
    }

    .spotlight-highlights {
      gap: var(--gap-m);
    }

    .spotlight-for-you {
      gap: var(--gap-s);
    }

    .spotlight-highlights {
      @include for-mobile {
        display: none;
      }
    }

    .overview-rail {
      display: none;

      @include for-desktop {
        display: flex;
        grid-column: 3;
        grid-row: 1;
      }
    }

    .overview-cards {
      --overview-card-columns: 1;
      --overview-card-gap: var(--gap-m);

      display: grid;
      grid-template-columns: repeat(
        var(--overview-card-columns),
        minmax(0, 1fr)
      );
      gap: var(--overview-card-gap);

      --width-override-card: calc(
        (
            100cqi - (var(--overview-card-columns) - 1) *
              var(--overview-card-gap)
          ) / var(--overview-card-columns)
      );
      --height-override-card-cover: calc(var(--width-override-card) * 1.5);
      --height-override-card: calc(
        var(--height-override-card-cover) + var(--height-card-footer)
      );
    }

    // Picks the column count that keeps cards closest to the regular card
    // width (8.25rem), then the cards stretch to fill the row.
    @for $columns from 2 through 10 {
      @container today-cards (min-width: #{($columns - 0.5) * 9.25 - 1}rem) {
        .overview-cards {
          --overview-card-columns: #{$columns};
        }
      }
    }

    @include for-mobile {
      .overview-cards {
        --overview-card-columns: 2;
      }
    }

    .overview-quiet {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-s);

      padding: var(--gap-m);
      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
    }
  }
</style>
