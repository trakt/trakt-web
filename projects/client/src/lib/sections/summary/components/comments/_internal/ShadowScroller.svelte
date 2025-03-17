<script lang="ts">
  import { setScrollInfo } from "./setScrollInfo";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-shadow-wrapper">
  <div class="trakt-shadow-scroller" use:setScrollInfo>
    {@render children()}
  </div>
</div>

<style>
  .trakt-shadow-wrapper {
    flex-grow: 1;
    overflow: auto;
    position: relative;

    &::before {
      --list-shadow-direction: to top;
      top: 0;
    }

    &::after {
      --list-shadow-direction: to bottom;
      bottom: 0;
    }

    &:global(:has(.scrolled-down))::before,
    &:global(:has(.scrolled-up))::after {
      opacity: 1;
    }

    &::before,
    &::after {
      content: "";
      z-index: var(--layer-floating);
      pointer-events: none;

      position: absolute;
      left: 0;

      width: 100%;
      height: var(--ni-24);

      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;

      background: linear-gradient(
        var(--list-shadow-direction),
        transparent 0%,
        var(--color-card-background) 100%
      );
    }
  }

  .trakt-shadow-scroller {
    height: 100%;
    overflow-y: auto;
  }
</style>
