<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { useCarouselScroll } from "$lib/components/carousel/useCarouselScroll.ts";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";

  const { points }: { points: ReadonlyArray<string> } = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  let track = $state<HTMLUListElement>();

  const { canScrollToStart, canScrollToEnd, scrollState, scrollObserver } =
    useCarouselScroll();

  const lastIndex = $derived(points.length - 1);

  const readActiveIndex = (element: HTMLElement) => {
    const [first, second] = Array.from(element.children);
    if (!first || !second) {
      return 0;
    }

    const step = Math.abs(
      (second as HTMLElement).offsetLeft - (first as HTMLElement).offsetLeft,
    );
    const offset = Math.abs(element.scrollLeft);
    const isAtEnd = offset >= element.scrollWidth - element.clientWidth - 1;

    return isAtEnd ? lastIndex : Math.round(offset / step);
  };

  const activeIndex = $derived(
    track && $scrollState ? readActiveIndex(track) : 0,
  );

  const goTo = (index: number) => {
    const target = track?.children.item(
      Math.min(Math.max(index, 0), lastIndex),
    );

    target?.scrollIntoView({
      behavior: $isReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  };
</script>

<div class="trakt-recap-key-moments">
  <div class="moments-header">
    <h3>{m.header_recap_key_moments()}</h3>

    <div class="moments-controls">
      <span class="small secondary moments-counter" aria-live="polite">
        {m.text_recap_key_moment_counter({
          current: activeIndex + 1,
          total: points.length,
        })}
      </span>
      <ActionButton
        label={m.button_label_carousel_previous()}
        variant="secondary"
        size="small"
        disabled={!$canScrollToStart}
        onclick={() => goTo(activeIndex - 1)}
      >
        <CaretLeftIcon />
      </ActionButton>
      <ActionButton
        label={m.button_label_carousel_next()}
        variant="secondary"
        size="small"
        disabled={!$canScrollToEnd}
        onclick={() => goTo(activeIndex + 1)}
      >
        <CaretRightIcon />
      </ActionButton>
    </div>
  </div>

  <ul
    class="moments-track"
    bind:this={track}
    use:scrollObserver
  >
    {#each points as point, index (index)}
      <li class="moment-card">
        <span class="moment-number">{String(index + 1).padStart(2, "0")}</span>
        <p class="moment-text"><InlineMarkdown text={point} /></p>
      </li>
    {/each}
  </ul>

  <div class="moments-dots" aria-hidden="true">
    {#each points as _, index (index)}
      <span class="moment-dot" class:is-active={index === activeIndex}></span>
    {/each}
  </div>
</div>

<style lang="scss">
  .trakt-recap-key-moments {
    --moment-card-width: min(var(--ni-292), 80%);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .moments-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .moments-controls {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
    }

    .moments-counter {
      margin-inline-end: var(--gap-xxs);
      font-variant-numeric: tabular-nums;
    }

    .moments-track {
      display: flex;
      gap: var(--gap-s);

      margin: 0;
      margin-inline: calc(-1 * var(--drawer-padding, var(--gap-m)));
      padding: 0;
      padding-inline: var(--drawer-padding, var(--gap-m));
      scroll-padding-inline: var(--drawer-padding, var(--gap-m));

      list-style: none;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .moment-card {
      display: flex;
      flex-direction: column;
      gap: var(--ni-10);

      flex: 0 0 var(--moment-card-width);
      box-sizing: border-box;
      min-height: var(--ni-168);
      padding: var(--gap-m) var(--ni-18);

      border-radius: var(--border-radius-l);
      background: var(--recap-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--recap-card-ring);
      scroll-snap-align: start;
    }

    .moment-number {
      font-size: var(--ni-40);
      font-weight: 300;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--color-text-emphasis);
    }

    .moment-text {
      line-height: var(--ni-20);

      :global(.trakt-inline-markdown) {
        font-size: inherit;
      }
    }

    .moments-dots {
      display: flex;
      justify-content: center;
      gap: var(--ni-8);
    }

    .moment-dot {
      width: var(--ni-8);
      height: var(--ni-8);
      border-radius: var(--ni-3);
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 22%,
        transparent
      );

      &.is-active {
        width: var(--ni-18);
        background-color: var(--color-vip-border-accent);
      }
    }
  }
</style>
