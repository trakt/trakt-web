<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import { getDayRange } from "./_internal/getDayRange.ts";
  import { pickHeroStory } from "./_internal/pickHeroStory.ts";
  import TodayFeedEntry from "./_internal/TodayFeedEntry.svelte";
  import TodayFeed from "./_internal/TodayFeed.svelte";
  import TodayForYouRow from "./_internal/TodayForYouRow.svelte";
  import TodayHero from "./_internal/TodayHero.svelte";
  import TodayMostActive from "./_internal/TodayMostActive.svelte";
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
  import type { TodayGrouping } from "./models/TodayGrouping.ts";
  import { useTodayDayCounts } from "./useTodayDayCounts.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const QUIET_ACTION_COUNT = 4;

  const { type }: { type: DiscoverMode } = $props();

  const { filterMap } = useFilter();
  const params = $derived(todayOverviewParams(page.url.searchParams));
  const dayKey = $derived(params.day);
  const now = new Date();
  const range = $derived(getDayRange({ dayKey, now }));

  const { activities, forYou, isLoading } = $derived(
    useTodayStories({ type, filter: $filterMap, range }),
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
  const isEmpty = $derived(
    !$isLoading && titles.length === 0 && stories.forYou.length === 0,
  );

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

  const toDayText = (day: (typeof days)[number]) => {
    const weekday = toHumanDayOfWeek(day.date, getLocale());
    const count = type === "media" ? $dayCounts[day.key] : null;

    return count == null
      ? weekday
      : m.text_today_day_with_count({ day: weekday, count });
  };
  const dayOptions: ToggleOption<string>[] = days.map((day) => ({
    value: day.key,
    text: () => toDayText(day),
    label: () => toDayText(day),
  }));

  const groupingOptions: ToggleOption<TodayGrouping>[] = [
    {
      value: "title",
      text: m.option_text_today_by_title,
      label: m.option_text_today_by_title,
    },
    {
      value: "person",
      text: m.option_text_today_by_person,
      label: m.option_text_today_by_person,
    },
    {
      value: "time",
      text: m.option_text_today_by_time,
      label: m.option_text_today_by_time,
    },
  ];

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

<div class="trakt-today-overview">
  <div class="overview-toolbar">
    <Toggler
      value={selectedDay?.key ?? ""}
      onChange={params.setDay}
      options={dayOptions}
      variant="text"
      ariaLabel={m.label_today_day()}
    />

    <div class="toolbar-end">
      <Toggler
        value={params.grouping}
        onChange={params.setGrouping}
        options={groupingOptions}
        variant="text"
        ariaLabel={m.label_today_grouping()}
      />

      {#if firstStory}
        {@const link = storyLink(firstStory.key)}
        <Button
          href={link.href}
          noscroll={link.noscroll}
          replacestate={link.replacestate}
          label={m.button_label_play_all_stories()}
          size="small"
          color="purple"
        >
          {m.button_text_play_all_stories()}
        </Button>
      {/if}
    </div>
  </div>

  <div class="overview-body">
    {#if hero || stories.forYou.length > 0}
      <section class="overview-column overview-spotlight">
        {#if hero}
          <h3>{m.text_today_top_story()}</h3>
          <TodayHero story={hero} />

          <div class="spotlight-highlights">
            {#each highlightCards as action (action.key)}
              <TodayFeedEntry {action} />
            {/each}
          </div>
        {/if}

        {#if stories.forYou.length > 0}
          <div class="spotlight-for-you">
            <h3>{m.text_today_for_you()}</h3>
            {#each stories.forYou as item (item.key)}
              <TodayForYouRow {item} />
            {/each}
          </div>
        {/if}
      </section>
    {/if}

    <div class="overview-column overview-main">
      {#if titles.length > 0}
        {#if params.grouping === "time"}
          <TodayFeed sections={feedSections} {now} />
        {:else}
          <h3>{m.text_today_from_friends()}</h3>
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
      <TodayMostActive groups={personGroups} onOpen={open} />
    </aside>
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

    padding-inline: var(--layout-distance-side);

    h3 {
      margin: 0;
    }

    .overview-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
    }

    .toolbar-end {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-s);
    }

    .overview-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);

      @include for-tablet-sm {
        display: grid;
        grid-template-columns: minmax(var(--ni-280), 1fr) minmax(0, 2fr);
        align-items: start;
      }

      @include for-tablet-lg {
        display: grid;
        grid-template-columns: minmax(var(--ni-280), 1fr) minmax(0, 2fr);
        align-items: start;
      }

      @include for-desktop {
        display: grid;
        grid-template-columns:
          minmax(var(--ni-280), 1fr)
          minmax(0, 1.4fr)
          minmax(var(--ni-240), 0.7fr);
        align-items: start;
      }
    }

    .overview-column {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      min-width: 0;
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
      gap: var(--gap-l);

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
      gap: var(--gap-m);
      margin-top: var(--gap-s);
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
      display: grid;
      grid-template-columns: repeat(auto-fill, var(--width-portrait-card));
      justify-content: start;
      gap: var(--gap-m);
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
