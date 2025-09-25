<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import { fade, slide } from "svelte/transition";
  import RateActionButton from "./_internal/RateActionButton.svelte";
  import { useIsRateable } from "./_internal/useIsRateable";
  import type { RateNowProps } from "./models/RateNowProps";
  import { useRatings } from "./useRatings";

  const { ...props }: RateNowProps = $props();

  const { isRateable } = $derived(useIsRateable(props));

  const type = $derived(props.type);
  const id = $derived(props.media.id);

  const { isRating, currentRating, addRating } = $derived(
    useRatings({
      type,
      id,
    }),
  );
</script>

{#if $isRateable}
  <div
    class="trakt-rate-now"
    data-dpad-navigation={DpadNavigationType.List}
    transition:slide={{ duration: 150 }}
  >
    <h6>{m.header_rate_now()}</h6>
    <div
      class="trakt-rate-actions"
      transition:fade={{ duration: 150, delay: 150 }}
    >
      {#each Object.values(SimpleRating) as simpleRating}
        <RateActionButton
          style="ghost"
          rating={simpleRating}
          isCurrentRating={$currentRating === simpleRating}
          isDisabled={$isRating || !$isRateable}
          onAddRating={(rating: SimpleRating) => {
            if ($currentRating === rating) {
              return;
            }
            addRating(rating);
          }}
        />
      {/each}
      {#if props.type !== "episode" && $currentRating !== undefined}
        <FavoriteAction
          style="action"
          title={props.media.title}
          type={props.type}
          id={props.media.id}
          navigationType={DpadNavigationType.Item}
        />
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rate-now {
    height: var(--ni-40);

    h6 {
      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }

    @include for-mobile {
      h6 {
        font-size: var(--ni-12);
      }
    }
  }
  .trakt-rate-now,
  .trakt-rate-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .trakt-rate-now {
    gap: var(--gap-m);
  }

  .trakt-rate-actions {
    gap: var(--gap-xs);
  }
</style>
