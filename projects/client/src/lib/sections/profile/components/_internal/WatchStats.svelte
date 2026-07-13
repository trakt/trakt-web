<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Stat from "$lib/components/stat/Stat.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { StatsCardStats } from "./StatsCardProps.ts";

  type WatchStatsProps = {
    stats: StatsCardStats;
    isLoading: boolean;
    size?: "normal" | "large";
  };

  const { stats, isLoading, size = "normal" }: WatchStatsProps = $props();

  const statVariant = $derived(size === "large" ? "plain" : "default");

  const getMainLabel = (
    value: number,
    labelFn: ({ count }: { count: string }) => string,
  ) => {
    const valueLabel = toHumanNumber(value, languageTag());
    return size === "large" ? valueLabel : labelFn({ count: valueLabel });
  };

  const baseStats = $derived([
    {
      label: getMainLabel(stats.episodeCount, m.text_episodes_watched),
      tagLabel: m.tag_text_episodes(),
      key: "episodes",
    },
    {
      label: getMainLabel(stats.showCount, m.text_shows_watched),
      tagLabel: m.tag_text_shows(),
      key: "shows",
    },
    {
      label: getMainLabel(stats.movieCount, m.text_movies_watched),
      tagLabel: m.tag_text_movies(),
      key: "movies",
    },
    {
      label: getMainLabel(stats.playCount, m.text_plays_watched),
      tagLabel: m.stat_text_plays(),
      key: "plays",
    },
  ]);

  // Extras render only in the large card layout, where a bare value + tag is
  // shown (no "{count} label" sentence), so no per-stat sentence messages are
  // needed. Each is included only when its value is provided by the caller.
  const extraStats = $derived(
    size !== "large" ? [] : [
      {
        present: stats.minuteCount != null,
        label: toHumanDuration(
          { minutes: stats.minuteCount ?? 0, clampAt: "hour" },
          languageTag(),
        ),
        tagLabel: m.stat_text_time_watched(),
        key: "time-watched",
      },
      {
        present: stats.ratingCount != null,
        label: toHumanNumber(stats.ratingCount ?? 0, languageTag()),
        tagLabel: m.label_stats_ratings(),
        key: "ratings",
      },
      {
        present: stats.listCount != null,
        label: toHumanNumber(stats.listCount ?? 0, languageTag()),
        tagLabel: m.stat_text_lists(),
        key: "lists",
      },
      {
        present: stats.commentCount != null,
        label: toHumanNumber(stats.commentCount ?? 0, languageTag()),
        tagLabel: m.label_stats_comments(),
        key: "comments",
      },
    ].filter((stat) => stat.present),
  );

  const watchStats = $derived([...baseStats, ...extraStats]);
</script>

{#snippet statIcon(key: string)}
  {#if key === "episodes" || key === "shows"}
    <ShowIcon />
  {:else if key === "movies"}
    <MovieIcon />
  {:else if key === "plays"}
    <PlayIcon />
  {:else if key === "time-watched"}
    <ClockIcon />
  {:else if key === "ratings"}
    <StarIcon fill="full" />
  {:else if key === "lists"}
    <SmartListIcon />
  {:else if key === "comments"}
    <CommentIcon />
  {/if}
{/snippet}

<div class="trakt-watch-stats" data-size={size}>
  {#each watchStats as stat (stat.key)}
    <Stat {isLoading} variant={statVariant}>
      {#snippet icon()}
        {@render statIcon(stat.key)}
      {/snippet}

      {stat.label}

      {#snippet tag()}
        {#if size === "large"}
          <p class="tag secondary">{stat.tagLabel}</p>
        {/if}
      {/snippet}
    </Stat>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-watch-stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &[data-size="large"] {
      // Fixed 3-column grid of equal tracks: two rows of three, every stat
      // pinned to the start of its column so the icons line up.
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      justify-items: start;
      align-items: center;
      width: 100%;
      gap: var(--gap-m);

      // Each stat fills its column (constrained, so long values ellipsis
      // instead of overflowing) with its icon pinned to the column's start,
      // so icons line up in a column across both rows.
      :global(.trakt-stat) {
        width: 100%;
        min-width: 0;
        justify-content: flex-start;
      }

      :global(svg) {
        width: var(--ni-32);
        height: var(--ni-32);
      }

      @include for-mobile {
        gap: var(--gap-s);

        :global(svg) {
          width: var(--ni-24);
          height: var(--ni-24);
        }
      }
    }
  }
</style>
