<script lang="ts">
  import { setScrollInfo } from "./setScrollInfo";

  const { children }: ChildrenProps = $props();

  // FIXME: remove this component when getting rid of scrollable comment & sentiment cards
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

    --mask-size: var(--ni-24);
    mask-image: none;

    &:global(:has(.scrolled-down):not(:has(.scrolled-up))) {
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black var(--mask-size),
        black 100%
      );
    }

    &:global(:has(.scrolled-up):not(:has(.scrolled-down))) {
      mask-image: linear-gradient(
        to top,
        transparent 0%,
        black var(--mask-size),
        black 100%
      );
    }

    &:global(:has(.scrolled-down):has(.scrolled-up)) {
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black var(--mask-size),
        black calc(100% - var(--mask-size)),
        transparent 100%
      );
    }
  }

  .trakt-shadow-scroller {
    height: 100%;
    min-height: var(--mask-size);

    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
