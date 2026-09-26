<script lang="ts">
  import QueuedTag from "$lib/components/badge/QueuedTag.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { slideFade } from "$lib/utils/transitions/slideFade";
  import { fade, slide } from "svelte/transition";
  import PopcornBurst from "./_internal/PopcornBurst.svelte";
  import { ratingDelight } from "./_internal/ratingDelight.ts";
  import RatingStars from "./_internal/RatingStars.svelte";
  import RottenTomato from "./_internal/RottenTomato.svelte";
  import { useIsRateable } from "./_internal/useIsRateable";
  import type { RatingDelight } from "./models/RatingDelight.ts";
  import type { RateNowProps } from "./models/RateNowProps";
  import { useRatings } from "./useRatings";

  const {
    variant = "guard",
    onclick,
    ...props
  }: RateNowProps & { variant?: "allow" | "guard" } = $props();

  const { isRateable } = $derived(useIsRateable(props));

  const type = $derived(props.type);
  const id = $derived(props.media.id);

  const {
    pendingRating,
    isSubmitting,
    isQueued,
    current,
    addRating,
    removeRating,
  } = $derived(
    useRatings({
      type,
      id,
    }),
  );

  const delight = writable<RatingDelight | null>(null);

  const setDelight = (rating: number, star?: HTMLElement) => {
    const kind = ratingDelight(rating);

    if (!kind || !star || !rootElement) {
      delight.set(null);
      return;
    }

    const offsetParent = star.offsetParent ?? rootElement;
    const offsetRect = offsetParent.getBoundingClientRect();
    const parentRect = rootElement.getBoundingClientRect();

    delight.set({
      kind,
      origin: {
        x: offsetRect.left + star.offsetLeft + star.offsetWidth / 2 -
          parentRect.left,
        y: offsetRect.top + star.offsetTop + star.offsetHeight / 2 -
          parentRect.top,
      },
    });
  };

  let rootElement: HTMLElement | null = $state(null);
</script>

{#if variant === "allow" || $isRateable}
  <div
    class="trakt-rate-now"
    bind:this={rootElement}
    data-dpad-navigation={DpadNavigationType.List}
    transition:slide={{ duration: 150 }}
  >
    <div
      class="trakt-rate-actions"
      transition:fade={{ duration: 150, delay: 150 }}
    >
      <RatingStars
        rating={$pendingRating ?? $current?.rating}
        isRating={$isSubmitting || $isQueued}
        onRemoveRating={() => {
          onclick?.();
          removeRating();
        }}
        onAddRating={(rating: number, star?: HTMLElement) => {
          onclick?.();
          setDelight(rating, star);
          addRating(rating);
        }}
      />

      {#if $isQueued}<QueuedTag />{/if}

      {#if props.type !== "episode" && props.type !== "season"}
        <div
          class="trakt-favorite-action"
          transition:slideFade={{ duration: 300, axis: "x" }}
        >
          <FavoriteAction
            style="action"
            title={props.media.title}
            type={props.type}
            id={props.media.id}
            navigationType={DpadNavigationType.Item}
            {onclick}
          />
        </div>
      {/if}
    </div>

    {#if $delight}
      {#key $delight}
        {#if $delight.kind === "popcorn"}
          <PopcornBurst origin={$delight.origin} />
        {:else}
          <RottenTomato origin={$delight.origin} />
        {/if}
      {/key}
    {/if}
  </div>
{/if}

<style>
  .trakt-rate-now,
  .trakt-rate-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .trakt-rate-now {
    height: var(--ni-40);

    position: relative;
  }

  .trakt-rate-actions {
    gap: var(--gap-s);
  }
</style>
