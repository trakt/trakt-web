<script lang="ts">
  import { type IsWatchedProps } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useSpoilerAction } from "../_internal/useSpoilerAction";
  import { spoilMeAnyway } from "./spoilMeAnyway";

  const { children, ...rest }: ChildrenProps & IsWatchedProps = $props();

  const { spoiler } = useSpoilerAction(rest);
</script>

<trakt-spoiler use:spoiler use:spoilMeAnyway>
  {@render children()}
</trakt-spoiler>

<style>
  trakt-spoiler {
    &:global(:not(:empty):not(:has(*))),
    :global(p:not(button p):not(a p)),
    :global(span:not(button span):not(a span)) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, padding;
    }

    &:global(.trakt-spoiler) {
      /* Target elements that contain only text */
      /* Target p and span that don't have button/anchor parents */
      &:global(:not(:empty):not(:has(*))),
      :global(p:not(button p):not(a p)),
      :global(span:not(button span):not(a span)) {
        --blur-size: calc(var(--ni-2) * 1.5);
        filter: blur(var(--blur-size));
        padding: 0 var(--blur-size);
      }
    }
  }
</style>
