<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import { fade, slide } from "svelte/transition";

  import { slideFade } from "$lib/utils/transitions/slideFade";
  import RatingStars from "./_internal/RatingStars.svelte";
  import { useIsRateable } from "./_internal/useIsRateable";
  import type { RateNowProps } from "./models/RateNowProps";
  import { useRatings } from "./useRatings";

  const {
    variant = "guard",
    ...props
  }: RateNowProps & { variant?: "allow" | "guard" } = $props();

  const { isRateable } = $derived(useIsRateable(props));

  const type = $derived(props.type);
  const id = $derived(props.media.id);

  const { pendingRating, current, addRating } = $derived(
    useRatings({
      type,
      id,
    }),
  );
</script>

{#if variant === "allow" || $isRateable}
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
      <RatingStars
        rating={$pendingRating ?? $current?.rating}
        isRating={$pendingRating !== null}
        onAddRating={(rating: number) => {
          if (rating === $current?.rating) {
            return;
          }

          addRating(rating);
        }}
      />

      {#if props.type !== "episode" && ($current?.isHighestRating || $current?.isFavorited)}
        <div
          class="trakt-favorite-action"
          transition:slideFade={{ duration: 300, axis: "x" }}
        >
          <FavoriteAction
            style="action"
            size="small"
            title={props.media.title}
            type={props.type}
            id={props.media.id}
            navigationType={DpadNavigationType.Item}
          />
        </div>
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
    gap: var(--gap-s);
  }
</style>
