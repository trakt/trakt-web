<script lang="ts">
  import { type IsWatchedProps } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useSpoilerAction } from "../_internal/useSpoilerAction";

  const { children, ...rest }: ChildrenProps & IsWatchedProps = $props();

  const { spoiler } = useSpoilerAction(rest);
</script>

<trakt-spoiler use:spoiler>
  {@render children()}
</trakt-spoiler>

<style>
  :global(.trakt-spoiler) {
    :global(p, span) {
      transition: padding var(--transition-duration) var(--transition-timing);
    }

    /* Target elements that contain only text */
    /* Target p and span that don't have button/anchor parents */
    :global(&:not(:empty):not(:has(*))),
    :global(p:not(button p):not(a p)),
    :global(span:not(button span):not(a span)) {
      --blur-size: calc(var(--ni-2) * 1.5);
      filter: blur(var(--blur-size));

      &:last-child {
        padding: 0 var(--blur-size);
      }
    }
  }
</style>
