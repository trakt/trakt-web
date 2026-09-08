<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { RateNowProps } from "$lib/sections/summary/components/rating/models/RateNowProps";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";

  type RateActionProps = {
    target: RateNowProps;
    title: string;
    style?: "cover" | "summary";
  };

  const { target, title, style = "cover" }: RateActionProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  let requestedOpen = $state(false);
  let ratingAtOpen = $state<number | undefined>(undefined);

  const { current } = $derived(
    useRatings({ type: target.type, id: target.media.id }),
  );

  const rating = $derived($current?.rating);

  const isOpen = $derived(requestedOpen && rating === ratingAtOpen);

  const onOpenChange = (open: boolean) => {
    requestedOpen = open;
    ratingAtOpen = open ? rating : undefined;
  };

  const label = $derived(
    rating
      ? m.button_label_change_rating({ title })
      : m.button_label_rate({ title }),
  );
</script>

{#snippet rateContent()}
  <div class="trakt-rate-action-popover">
    <RateNow {...target} variant="allow" />
  </div>
{/snippet}

<div class="trakt-rate-action-root" data-style={style}>
  <Tooltip content={label} variant="compact" disabled={!$isMouse}>
    <Popover
      content={rateContent}
      {label}
      open={isOpen}
      {onOpenChange}
    >
      <span class="trakt-rate-action" class:is-rated={Boolean(rating)}>
        {#if rating}
          <UserRating {rating} />
        {:else}
          <RatingIcon style="unrated" variant="user" />
        {/if}
      </span>
    </Popover>
  </Tooltip>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rate-action-root {
    display: flex;
    align-items: center;

    &[data-style="summary"] {
      margin: var(--ni-neg-6);
    }
  }

  @include icon-button-box(".trakt-rate-action");
  @include icon-button-ghost(".trakt-rate-action", scale(0.92));

  .trakt-rate-action {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: var(--ni-32);
    min-height: var(--ni-32);

    color: var(--color-foreground);

    :global(svg) {
      filter: drop-shadow(
        var(--ni-2) var(--ni-2) var(--ni-2)
          color-mix(in srgb, var(--color-shadow) 25%, transparent)
      );
    }

    &:not(.is-rated) :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-rate-action-popover {
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background-color: var(--color-modal-background);
    box-shadow: var(--shadow-menu);
  }
</style>
