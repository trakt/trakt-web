<script lang="ts">
  import { type IsWatchedProps } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { spoiler } from "../_internal/spoiler.ts";
  import { useMediaSpoiler } from "../useMediaSpoiler.ts";
  import { spoilMeAnyway } from "./spoilMeAnyway";

  const {
    children,
    variant = "dismissible",
    ...rest
  }: { variant?: "persistent" | "dismissible" } & ChildrenProps &
    IsWatchedProps = $props();

  const { isSpoilerHidden } = $derived(useMediaSpoiler(rest));
</script>

<trakt-spoiler
  use:spoiler={isSpoilerHidden}
  use:spoilMeAnyway={variant !== "persistent"}
  data-variant={variant}
>
  {@render children()}
</trakt-spoiler>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-spoiler {
    &:global(:not(:empty):not(:has(*))),
    :global(p:not(button p):not(a p)),
    :global(.trakt-comment p),
    :global(span:not(button span):not(a span)) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, padding;
    }

    &:global(.trakt-spoiler) {
      /* Target elements that contain only text */
      /* Target p and span that don't have button/anchor parents */
      &:global(:not(:empty):not(:has(*))),
      :global(p:not(button p):not(a p)),
      :global(.trakt-comment p),
      :global(span:not(button span):not(a span)) {
        @include spoiler-blur();
      }

      :global(p:not(button p):not(a p)),
      :global(.trakt-comment p),
      :global(span:not(button span):not(a span)) {
        pointer-events: none;
      }

      &[data-variant="dismissible"] {
        cursor: pointer;
      }
    }
  }
</style>
