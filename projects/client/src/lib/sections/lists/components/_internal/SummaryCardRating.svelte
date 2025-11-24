<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";

  const { item }: { item: MediaEntry | EpisodeEntry } = $props();
  const hasAired = $derived(!!item.airDate && item.airDate <= new Date());
</script>

{#if item.rating && hasAired}
  <div class="trakt-summary-card-rating">
    <RatingIcon style="rated" />
    <p class="bold">{toPercentage(item.rating, languageTag())}</p>
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
