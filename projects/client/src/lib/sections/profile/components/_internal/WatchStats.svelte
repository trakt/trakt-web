<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Stat from "$lib/components/stat/Stat.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { MonthToDateDetails } from "../../models/MonthToDateDetails";

  const {
    monthToDate,
    isLoading,
    size = "normal",
  }: {
    monthToDate: MonthToDateDetails;
    isLoading: boolean;
    size?: "normal" | "large";
  } = $props();

  const statVariant = $derived(size === "large" ? "plain" : "default");

  const getMainLabel = (
    value: number,
    labelFn: ({ count }: { count: number }) => string,
  ) => {
    return size === "large"
      ? toHumanNumber(value, languageTag())
      : labelFn({ count: value });
  };

  const watchStats = $derived([
    {
      label: getMainLabel(monthToDate.episodeCount, m.text_episodes_watched),
      tagLabel: m.tag_text_episodes(),
      icon: ShowIcon,
    },
    {
      label: getMainLabel(monthToDate.showCount, m.text_shows_watched),
      tagLabel: m.tag_text_shows(),
      icon: ShowIcon,
    },
    {
      label: getMainLabel(monthToDate.movieCount, m.text_movies_watched),
      tagLabel: m.tag_text_movies(),
      icon: MovieIcon,
    },
  ] as const);
</script>

<div class="trakt-watch-stats" data-size={size}>
  {#each watchStats as stat}
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

<style>
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
    }
  }
</style>
