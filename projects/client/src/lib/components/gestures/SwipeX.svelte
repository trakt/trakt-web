<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { writable } from "$lib/utils/store/WritableSubject";
  import { DragGesture } from "@use-gesture/vanilla";
  import type { Snippet } from "svelte";

  type SwipeXState = {
    progress: number;
    direction: "left" | "right" | "inactive";
    isActive: boolean;
  };

  type Direction = "left" | "right";

  type SwipeXProps = {
    classList: string;
    indicator: Snippet<[SwipeXState]>;
    directions: Direction[];
    onSwipe: (state: SwipeXState) => void;
  };

  const {
    children,
    classList,
    indicator,
    directions,
    onSwipe,
  }: ChildrenProps & SwipeXProps = $props();

  const swipeState = writable<SwipeXState>({
    progress: 0,
    direction: "inactive",
    isActive: false,
  });

  function setupGesture(node: HTMLDivElement) {
    const threshold = window.innerWidth * 0.25;

    if (!node) return;

    const gesture = new DragGesture(
      node,
      (state) => {
        const {
          last,
          movement: [movementX],
        } = state;

        const x = last ? 0 : movementX;
        const clampedX = Math.sign(x) * Math.min(Math.abs(x), threshold);
        const absX = Math.abs(clampedX);
        const progress = Math.min(Math.abs(x) / threshold, 1);
        const direction = movementX > 0 ? "right" : "left";

        if (!directions.includes(direction)) {
          return;
        }

        node.dataset.state = last ? "idle" : "active";
        node.style.setProperty("--swipe-progress", progress.toString());
        node.style.setProperty("--swipe-x", `${clampedX}px`);

        if (direction === "right") {
          node.style.setProperty("--indicator-right", ``);
          node.style.setProperty("--indicator-left", `-${clampedX}px`);
          node.style.setProperty("--indicator-width", `${absX}px`);
        }

        if (direction === "left") {
          node.style.setProperty("--indicator-left", ``);
          node.style.setProperty("--indicator-right", `${clampedX}px`);
          node.style.setProperty("--indicator-width", `${absX}px`);
        }

        const color = (() => {
          if (last) {
            return "transparent";
          }

          return direction === "right"
            ? "var(--indicator-color-right)"
            : "var(--indicator-color-left)";
        })();

        node.style.setProperty("--indicator-color", color);

        const isActive = Math.abs(x) > threshold * 0.9;

        const { isActive: isPreviouslyActive } = swipeState.getValue();

        const isTriggered = isPreviouslyActive && last;

        swipeState.set({
          progress,
          direction,
          isActive,
        });

        if (isTriggered) {
          onSwipe($swipeState);
        }
      },
      {
        axis: "x",
        filterTaps: true,
        pointer: {
          touch: true,
          mouse: false,
          keys: false,
        },
      },
    );

    return {
      destroy() {
        gesture.destroy();
      },
    };
  }
</script>

<div
  class="trakt-gesture-container"
  data-state="idle"
  use:appendClassList={classList}
  use:setupGesture
>
  {@render indicator($swipeState)}
  {@render children()}
</div>

<style>
  .trakt-gesture-container {
    touch-action: pan-y;

    position: relative;
    min-width: 100%;

    will-change: transform;

    transform: translateX(var(--swipe-x));

    &[data-state="idle"] {
      transition: transform var(--transition-increment)
        cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  :global(.trakt-gesture-container .trakt-gesture-indicator) {
    position: absolute;

    height: var(--indicator-height, 100%);

    left: var(--indicator-left);
    right: var(--indicator-right);
    width: var(--indicator-width, 0);

    background-color: var(--indicator-color, transparent);
    opacity: var(--swipe-progress, 0);
  }

  :global(
    .trakt-gesture-container[data-state="idle"] .trakt-gesture-indicator
  ) {
    transition:
      opacity var(--transition-increment) ease-out,
      width var(--transition-increment) ease-out,
      background-color var(--transition-increment) ease-out,
      left var(--transition-increment) ease-out,
      right var(--transition-increment) ease-out,
      color var(--transition-increment) ease-out,
      outline-color var(--transition-increment) ease-out;
  }
</style>
