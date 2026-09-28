<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import { getDayRange } from "./_internal/getDayRange.ts";
  import TodayForYouRow from "./_internal/TodayForYouRow.svelte";
  import { todayOverviewParams } from "./_internal/todayOverviewParams.ts";
  import TodayPersonDrawer from "./_internal/TodayPersonDrawer.svelte";
  import TodayPersonTile from "./_internal/TodayPersonTile.svelte";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import TodayTitleDrawer from "./_internal/TodayTitleDrawer.svelte";
  import TodayTitleTile from "./_internal/TodayTitleTile.svelte";
  import { toPersonGroups } from "./_internal/toPersonGroups.ts";
  import { toFilteredStories } from "./_internal/toFilteredStories.ts";
  import { toTodayDays } from "./_internal/toTodayDays.ts";
  import type { TodayFilter } from "./models/TodayFilter.ts";
  import type { TodayGrouping } from "./models/TodayGrouping.ts";
  import { useTodayStories } from "./useTodayStories.ts";

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

  const filtered = $derived(
    toFilteredStories({
      activities: $activities ?? [],
      forYou: $forYou ?? [],
      filter: params.filter,
    }),
  );
  const filteredTitles = $derived(filtered.titles);
  const personGroups = $derived(toPersonGroups(filteredTitles));
  const firstStory = $derived(filtered.groups.at(0));
  const counts = $derived(
    ($activities ?? []).reduce(
      (result, { detail }) => ({
        ...result,
        [detail.action]: result[detail.action] + 1,
      }),
      { watch: 0, rating: 0, comment: 0 },
    ),
  );
  const isEmpty = $derived(
    !$isLoading &&
      filteredTitles.length === 0 &&
      filtered.forYou.length === 0,
  );

  const days = toTodayDays(now);
  const selectedDay = $derived(
    days.find((day) => day.key === params.day) ?? days.at(0),
  );
  const dayOptions: ToggleOption<string>[] = days.map((day) => ({
    value: day.key,
    text: () => toHumanDayOfWeek(day.date, getLocale()),
    label: () => toHumanDayOfWeek(day.date, getLocale()),
  }));

  const filterOptions: ToggleOption<TodayFilter>[] = [
    { value: "all", text: m.option_text_today_all, label: m.option_text_today_all },
    {
      value: "mine",
      text: m.option_text_today_for_you,
      label: m.option_text_today_for_you,
    },
    {
      value: "watched",
      text: m.option_text_today_watched,
      label: m.option_text_today_watched,
    },
    {
      value: "rated",
      text: m.option_text_today_rated,
      label: m.option_text_today_rated,
    },
    {
      value: "comments",
      text: m.option_text_today_comments,
      label: m.option_text_today_comments,
    },
  ];

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
  ];

  const openStory = $derived(
    filteredTitles.find((story) => story.key === openKey),
  );
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

    <Toggler
      value={params.filter}
      onChange={params.setFilter}
      options={filterOptions}
      variant="text"
      ariaLabel={m.label_today_filter()}
    />

    {#if params.filter !== "mine"}
      <Toggler
        value={params.grouping}
        onChange={params.setGrouping}
        options={groupingOptions}
        variant="text"
        ariaLabel={m.label_today_grouping()}
      />
    {/if}

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

  <div class="overview-body">
    <aside class="overview-aside">
      <div class="overview-counters">
        <div class="overview-counter">
          <p class="bold">{($forYou ?? []).length}</p>
          <p class="small secondary">{m.text_today_counter_for_you()}</p>
        </div>
        <div class="overview-counter">
          <p class="bold">{counts.watch}</p>
          <p class="small secondary">{m.text_today_counter_watches()}</p>
        </div>
        <div class="overview-counter">
          <p class="bold">{counts.rating}</p>
          <p class="small secondary">{m.text_today_counter_ratings()}</p>
        </div>
        <div class="overview-counter">
          <p class="bold">{counts.comment}</p>
          <p class="small secondary">{m.text_today_counter_comments()}</p>
        </div>
      </div>

      {#if filtered.forYou.length > 0}
        <section class="overview-section">
          <h3>{m.text_today_for_you()}</h3>
          {#each filtered.forYou as item (item.key)}
            <TodayForYouRow {item} />
          {/each}
        </section>
      {/if}
    </aside>

    <div class="overview-main">
      {#if filteredTitles.length > 0}
        <section class="overview-section">
          <h3>{m.text_today_from_friends()}</h3>
          <div class="overview-cards">
            {#if params.grouping === "title"}
              {#each filteredTitles as story (story.key)}
                <TodayTitleTile {story} onOpen={() => open(story.key)} />
              {/each}
            {:else}
              {#each personGroups as group (group.key)}
                <TodayPersonTile {group} onOpen={() => open(group.key)} />
              {/each}
            {/if}
          </div>
        </section>
      {/if}

      {#if isEmpty}
        <p class="secondary">
          {selectedDay?.isToday === false
            ? m.text_today_empty_day()
            : m.text_today_empty()}
        </p>
      {/if}
    </div>
  </div>
</div>

{#if params.grouping === "title" && openStory}
  <TodayTitleDrawer story={openStory} onClose={close} />
{/if}

{#if params.grouping === "person" && openPerson}
  <TodayPersonDrawer group={openPerson} onClose={close} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-overview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding-inline: var(--layout-distance-side);

    .overview-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-s);
    }

    .overview-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);

      @include for-desktop {
        display: grid;
        grid-template-columns: minmax(var(--ni-320), 1fr) minmax(0, 3fr);
        align-items: start;
      }
    }

    .overview-aside {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);

      @include for-desktop {
        position: sticky;
        top: var(--gap-l);
      }
    }

    .overview-main {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);
      min-width: 0;
    }

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, var(--width-portrait-card));
      justify-content: start;
      gap: var(--gap-m);
    }

    .overview-counters {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--gap-xs);
    }

    .overview-counter {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      padding: var(--gap-s);
      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      border: var(--border-thickness-xxs) solid var(--color-border);
    }

    .overview-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);

      h3 {
        margin: 0;
      }
    }
  }
</style>
