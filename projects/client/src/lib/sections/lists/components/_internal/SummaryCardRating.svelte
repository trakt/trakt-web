<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";

  const { item }: { item: MediaEntry | EpisodeEntry } = $props();
  const hasAired = $derived(!!item.airDate && item.airDate <= new Date());
</script>

{#if item.rating && hasAired}
  <div class="trakt-summary-card-rating">
    <RatingIcon style="rated" />
    <p class="bold">{toTraktRating(item.rating, getLocale())}</p>
  </div>
{/if}

<style>
  .trakt-summary-card-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
