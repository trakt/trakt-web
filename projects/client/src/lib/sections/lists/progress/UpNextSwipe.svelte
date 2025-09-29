<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { attachWarning } from "$lib/sections/media-actions/_internal/attachWarning";
  import DropSwipeIndicator from "$lib/sections/media-actions/drop/DropSwipeIndicator.svelte";
  import { useDrop } from "$lib/sections/media-actions/drop/useDrop";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type UpNextEpisodeProps = {
    episode: EpisodeProgressEntry;
    show: ShowEntry;
    style: "cover" | "summary";
  } & ChildrenProps;

  const { episode, show, style, children }: UpNextEpisodeProps = $props();

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "episode",
      media: episode,
      show: show,
    }),
  );

  const { drop } = $derived(
    useDrop({
      ids: [show.id],
    }),
  );

  /**
   * TODO: @seferturan Single source of truth for warning messages
   */
  const onDropHandler = $derived(
    attachWarning(drop, m.warning_prompt_drop_show({ title: show.title })),
  );
</script>

{#if style === "summary"}
  <SwipeX
    {children}
    directions={["left", "right"]}
    classList="trakt-up-next-episode"
    onSwipe={(state) => {
      if (state.direction === "left") {
        markAsWatched();
      }

      if (state.direction === "right") {
        onDropHandler();
      }
    }}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive, direction })}
      {#if direction === "left"}
        <MarkAsWatchedSwipeIndicator {isActive} />
      {/if}

      {#if direction === "right"}
        <DropSwipeIndicator {isActive} />
      {/if}
    {/snippet}
  </SwipeX>
{:else}
  {@render children()}
{/if}
