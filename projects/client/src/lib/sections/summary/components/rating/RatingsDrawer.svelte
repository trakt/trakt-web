<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { getDisplayableRatings } from "$lib/components/summary/_internal/getDisplayableRatings";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fade } from "svelte/transition";
  import { useMediaMetaInfo } from "../media/useMediaMetaInfo.ts";
  import RatingsDistribution from "./_internal/RatingsDistribution.svelte";
  import type { RatingsDrawerProps } from "./_internal/RatingsDrawerProps.ts";
  import SeasonRatingsChart from "./_internal/SeasonRatingsChart.svelte";

  const { onClose, seasons, elevated = false, ...props }: RatingsDrawerProps =
    $props();

  const metaInfoTarget = $derived(
    props.type === "episode"
      ? {
          type: "episode" as const,
          media: props.show,
          episode: props.episode,
        }
      : { type: props.type, media: props.media },
  );

  const entry = $derived(
    props.type === "episode" ? props.episode : props.media,
  );

  const { ratings: rawRatings, isLoading } = $derived(
    useMediaMetaInfo(metaInfoTarget),
  );

  const ratings = $derived(
    getDisplayableRatings({ ratings: $rawRatings, entry }),
  );

  const hasAnyRating = $derived(
    ratings.trakt != null || ratings.imdb != null || ratings.rotten != null,
  );

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  {elevated}
  onOpened={() => (isOpen = true)}
  title={m.header_ratings()}
  size="auto"
>
  {#if isOpen}
    <div
      class="trakt-ratings-drawer-content"
      transition:fade={{ duration: 150 }}
    >
      {#if !hasAnyRating}
        <p class="ratings-empty secondary">{m.text_ratings_no_data()}</p>
      {:else}
        {#if ratings.trakt}
          <RatingsDistribution trakt={ratings.trakt} />
        {/if}

        {#if props.type === "show" && seasons}
          <SeasonRatingsChart {seasons} />
        {/if}

        <section class="ratings-card official-card">
          <h3 class="card-title bold secondary">
            {m.header_ratings_official()}
          </h3>
          <div class="official-row">
            <RatingList {ratings} {entry} variant="external" isLoading={$isLoading} />
          </div>
        </section>
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .trakt-ratings-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .ratings-empty {
    color: var(--color-text-secondary);
  }

  .ratings-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .card-title {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: var(--font-size-text-small);
  }

  .official-card {
    padding-block: var(--ni-16);
  }

  .official-row {
    --color-link-active: var(--color-text-primary);

    display: flex;
    justify-content: center;

    :global(.trakt-summary-ratings) {
      width: 100%;
      justify-content: space-between;
      gap: 0;
    }
  }
</style>
