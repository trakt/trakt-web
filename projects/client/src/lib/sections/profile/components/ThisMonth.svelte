<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import MonthToDateStat from "./_internal/MonthToDateStat.svelte";

  const { slug }: { slug: string } = $props();

  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
  // TODO actual date
  const href = $derived(UrlBuilder.users(slug).monthInReview(2026, 1));
</script>

<div class="trakt-this-month">
  <span class="secondary bold">This month</span>
  <div class="trakt-this-month-content">
    <div class="stats">
      <MonthToDateStat
        value={$monthToDate.totalPlays}
        label="Plays"
        isLoading={$isLoading}
      >
        <PlayIcon />
      </MonthToDateStat>

      <MonthToDateStat
        value={$monthToDate.episodeCount}
        label="Eps"
        isLoading={$isLoading}
      >
        <ShowIcon />
      </MonthToDateStat>

      <MonthToDateStat
        value={$monthToDate.movieCount}
        label="Movies"
        isLoading={$isLoading}
      >
        <MovieIcon />
      </MonthToDateStat>
    </div>
    <Button {href} label="TODO" size="small">
      <p class="uppercase">January in review</p>
      {#snippet icon()}<CaretRightIcon />{/snippet}
    </Button>
  </div>
</div>

<style>
  .trakt-this-month,
  .trakt-this-month-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-this-month {
    height: 100%;
    width: 100%;
    max-width: var(--ni-288);
  }

  .trakt-this-month-content {
    flex-grow: 1;
    justify-content: space-between;

    :global(.trakt-button-link) {
      border: var(--ni-1) solid var(--color-text-primary);
    }
  }

  .stats {
    display: flex;
    align-items: center;
    gap: var(--gap-l);

    flex-grow: 1;
  }
</style>
