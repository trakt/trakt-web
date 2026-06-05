<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Stat from "$lib/components/stat/Stat.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  type WatchStats = {
    movieCount: number;
    showCount: number;
    episodeCount: number;
  };

  type WatchStatsProps = {
    stats: WatchStats;
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

  const watchStats = $derived([
    {
      label: getMainLabel(stats.episodeCount, m.text_episodes_watched),
      tagLabel: m.tag_text_episodes(),
      icon: ShowIcon,
      key: "episodes",
    },
    {
      label: getMainLabel(stats.showCount, m.text_shows_watched),
      tagLabel: m.tag_text_shows(),
      icon: ShowIcon,
      key: "shows",
    },
    {
      label: getMainLabel(stats.movieCount, m.text_movies_watched),
      tagLabel: m.tag_text_movies(),
      icon: MovieIcon,
      key: "movies",
    },
  ] as const);
</script>

<div class="trakt-watch-stats" data-size={size}>
  {#each watchStats as stat (stat.key)}
    <Stat {isLoading} variant={statVariant}>
      {#snippet icon()}
        {@const Icon = stat.icon}
        <Icon />
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
      gap: var(--gap-m);

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
