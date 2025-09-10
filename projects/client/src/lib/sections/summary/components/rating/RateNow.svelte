<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import { fade } from "svelte/transition";
  import RateActionButton from "./_internal/RateActionButton.svelte";
  import { useIsRateable } from "./_internal/useIsRateable";
  import { useRatings } from "./useRatings";

  type RateableEpisode = {
    type: "episode";
    media: EpisodeEntry;
    show: ShowEntry;
  };

  type RateableMedia = {
    type: MediaType;
    media: MediaEntry;
  };

  type RateNowProps = RateableEpisode | RateableMedia;

  const {
    style = "flat",
    ...props
  }: {
    style?: "flat" | "ghost";
  } & RateNowProps = $props();

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

<div class="trakt-rate-now" data-dpad-navigation={DpadNavigationType.List}>
  {#if $isRateable}
    <h6>{m.header_rate_now()}</h6>
    <div class="trakt-rate-actions" transition:fade={{ duration: 150 }}>
      {#each Object.values(SimpleRating) as simpleRating}
        <RateActionButton
          {style}
          rating={simpleRating}
          isCurrentRating={$currentRating === simpleRating}
          isDisabled={$isRating}
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
  {/if}
</div>

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
