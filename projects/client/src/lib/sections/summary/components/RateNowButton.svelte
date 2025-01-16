<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import { useRatings } from "$lib/stores/useRatings.ts";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue.ts";

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

<div class="trakt-rate-now-button">
  <DropdownList
    label={m.rate_now()}
    style="flat"
    size="normal"
    color="custom"
    disabled={$isRating}
    --color-background-custom="var(--red-900)"
    --color-foreground-custom="var(--red-400)"
  >
    {#if $currentRating}
      {toTranslatedValue("rating", $currentRating)}
    {:else}
      {m.rate_now()}
    {/if}

    {#snippet icon()}
      {#if !$currentRating}
        <RateIcon />
      {/if}
    {/snippet}

    {#snippet items()}
      {#each Object.values(SimpleRating) as simpleRating}
        <DropdownItem
          color="red"
          onclick={() => {
            if ($currentRating === simpleRating) {
              return;
            }
            addRating(simpleRating, $isFavorited);
          }}
        >
          {toTranslatedValue("rating", simpleRating)}
        </DropdownItem>
      {/each}
    {/snippet}
  </DropdownList>
</div>

<style>
  .trakt-rate-now-button {
    :global(.trakt-button) {
      min-width: var(--ni-252);
    }
  }
</style>
