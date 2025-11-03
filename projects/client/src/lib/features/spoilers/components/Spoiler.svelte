<script lang="ts">
  import { type IsWatchedProps } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { NOOP_FN } from "$lib/utils/constants";
  import { useSpoilerAction } from "../_internal/useSpoilerAction";
  import { spoilMeAnyway } from "./spoilMeAnyway";

  const {
    children,
    variant = "dismissible",
    ...rest
  }: { variant?: "persistent" | "dismissible" } & ChildrenProps &
    IsWatchedProps = $props();

  const { spoiler } = $derived(useSpoilerAction(rest));
  const spoilAction = $derived(
    variant === "persistent" ? NOOP_FN : spoilMeAnyway,
  );
</script>

<trakt-spoiler use:spoiler use:spoilAction>
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
        pointer-events: none;

        @include spoiler-blur();
      }
    }
  }
</style>
