<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import { slideFade } from "$lib/utils/transitions/slideFade";
  import { writable } from "svelte/store";
  import { fade, slide } from "svelte/transition";
  import RatingStars from "./_internal/RatingStars.svelte";
  import StarsConfetti from "./_internal/StarsConfetti.svelte";
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

  const confettiPosition = writable<{ x: number; y: number } | null>(null);
  const setConfettiPosition = (rating: number, ev: MouseEvent) => {
    const isMaxRating = rating === 10;
    const hasValidTarget = ev.currentTarget instanceof HTMLElement;

    if (!isMaxRating || !rootElement || !hasValidTarget) {
      confettiPosition.set(null);
      return;
    }

    const targetRect = ev.currentTarget.getBoundingClientRect();
    const parentRect = rootElement.getBoundingClientRect();

    const x = targetRect.left + targetRect.width / 2 - parentRect.left;
    confettiPosition.set({ x, y: 0 });
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
    <span class="bold">{m.header_rate_now()}</span>
    <div
      class="trakt-rate-actions"
      transition:fade={{ duration: 150, delay: 150 }}
    >
      <RatingStars
        rating={$pendingRating ?? $current?.rating}
        isRating={$pendingRating !== null}
        onAddRating={(rating: number, ev: MouseEvent) => {
          if (rating === $current?.rating) {
            return;
          }

          setConfettiPosition(rating, ev);
          addRating(rating);
        }}
      />

      {#if props.type !== "episode" && ($current?.rating || $current?.isFavorited)}
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

    {#if $confettiPosition}
      <StarsConfetti position={$confettiPosition} />
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

    gap: var(--gap-m);
  }

  .trakt-rate-actions {
    gap: var(--gap-s);
  }
</style>
