<script lang="ts">
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import { usePortal } from "$lib/features/portal/usePortal";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import RateActionButton from "../../../rating/_internal/RateActionButton.svelte";
  import { useRatings } from "../../../rating/useRatings";
  import MediaAction from "./MediaAction.svelte";

  const { media, type }: { media: MediaEntry; type: MediaType } = $props();

  const { portalTrigger, portal, isOpened } = usePortal({
    placement: { position: "top" },
  });

  const { isRating, currentRating, addRating } = $derived(
    useRatings({
      type,
      id: media.id,
    }),
  );

  const iconColor = $derived(
    $currentRating === SimpleRating.Great
      ? "var(--red-500)"
      : "var(--color-foreground)",
  );
  const iconFillColor = $derived($currentRating ? iconColor : "none");

  const text = $derived.by(() => {
    if (!$currentRating) {
      return "Rate";
    }

    switch ($currentRating) {
      case SimpleRating.Bad:
        return "Disliked";
      case SimpleRating.Good:
        return "Liked";
      case SimpleRating.Great:
        return "Loved";
    }
  });
  // TODO similar transition as reactions
  // TODO rate-ableness
</script>

<MediaAction {text} label="TODO" action={portalTrigger} disabled={$isRating}>
  <RateIcon
    rating={$currentRating}
    --icon-color={iconColor}
    --icon-fill-color={iconFillColor}
  />
</MediaAction>

{#if $isOpened}
  <div class="trakt-rate-popup" use:portal>
    {#each Object.values(SimpleRating) as simpleRating}
      <RateActionButton
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
  </div>
{/if}

<style>
  .trakt-rate-popup {
    position: absolute;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);

    padding: var(--gap-xs);

    margin-bottom: var(--ni-12);
  }
</style>
