<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import RateActionButton from "./_internal/RateActionButton.svelte";
  import { useRatings } from "./useRatings";

  const {
    type,
    id,
  }: {
    type: "movie" | "episode";
    id: number;
  } = $props();

  const { isRating, isFavorited, currentRating, addRating } = $derived(
    useRatings({
      type,
      id,
    }),
  );
</script>

<div class="trakt-rate-now">
  <h6>{m.rate_now()}</h6>
  <div class="trakt-rate-actions">
    {#each Object.values(SimpleRating) as simpleRating}
      <RateActionButton
        rating={simpleRating}
        isCurrentRating={$currentRating === simpleRating}
        isDisabled={$isRating}
        onAddRating={(rating: SimpleRating) => {
          if ($currentRating === rating) {
            return;
          }
          addRating(rating, $isFavorited);
        }}
      />
    {/each}
  </div>
</div>

<style>
  .trakt-rate-now,
  .trakt-rate-actions {
    display: flex;
    align-items: center;
  }

  .trakt-rate-now {
    gap: var(--gap-m);
  }

  .trakt-rate-actions {
    gap: var(--gap-xs);
  }
</style>
