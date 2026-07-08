<script lang="ts">
  import Stat from "$lib/components/stat/Stat.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import StatIcon from "./StatIcon.svelte";
  import type { StatIconKey } from "./StatIconKey.ts";
  import type { StatsCardStats } from "./StatsCardProps.ts";

  type WatchStatsProps = {
    stats: StatsCardStats;
    isLoading: boolean;
    size?: "normal" | "large";
  };

  type StatEntry = {
    label: string;
    tagLabel: string;
    key: StatIconKey;
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

  const baseStats = $derived<StatEntry[]>([
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

  const extraStats = $derived<StatEntry[]>(
    size !== "large"
      ? []
      : (
          [
            {
              present: stats.minuteCount != null,
              label: toHumanDuration(
                { minutes: stats.minuteCount ?? 0, clampAt: "hour" },
                languageTag(),
              ),
              tagLabel: m.stat_text_time_watched(),
              key: "hours",
            },
            {
              present: stats.ratingCount != null,
              label: toHumanNumber(stats.ratingCount ?? 0, languageTag()),
              tagLabel: m.label_stats_ratings(),
              key: "ratings",
            },
            {
              present: stats.commentCount != null,
              label: toHumanNumber(stats.commentCount ?? 0, languageTag()),
              tagLabel: m.label_stats_comments(),
              key: "comments",
            },
          ] satisfies Array<StatEntry & { present: boolean }>
        ).filter((stat) => stat.present),
  );

  const watchStats = $derived([...baseStats, ...extraStats]);
</script>

<div class="trakt-watch-stats" data-size={size}>
  {#each watchStats as stat (stat.key)}
    <Stat {isLoading} variant={statVariant}>
      {#snippet icon()}
        <StatIcon key={stat.key} />
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
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      justify-items: start;
      align-items: center;
      width: 100%;
      gap: var(--gap-m);

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
