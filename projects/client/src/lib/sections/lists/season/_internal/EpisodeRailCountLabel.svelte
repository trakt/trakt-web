<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CardUrlOverride } from "$lib/sections/lists/components/models/CardUrlOverride";

  /*
    What the rail is hiding either side of the viewport. It starts docked to
    the rail's edge, centred on the stills, and the first time the rail
    scrolls it glides up into the strip above them and stays there as a small
    label - never over the artwork. It lives outside the cards so it survives
    scrolling.
  */
  const {
    side,
    count,
    link,
    isDocked,
  }: {
    side: "start" | "end";
    count: number;
    link: CardUrlOverride;
    isDocked: boolean;
  } = $props();

  const label = $derived(
    side === "start"
      ? m.button_label_earlier_episodes({ count })
      : m.button_label_later_episodes({ count }),
  );

  /* A minus for what is behind, a plus for what is ahead. */
  const sign = $derived(side === "start" ? "−" : "+");
  const isVisible = $derived(count > 0);
</script>

<div
  class="trakt-episode-rail-count-label"
  data-side={side}
  data-docked={isDocked}
  data-visible={isVisible}
  inert={!isVisible}
>
  <Link
    href={link.href}
    noscroll={link.noscroll}
    replacestate={link.replacestate}
    color="inherit"
    {label}
  >
    {#if side === "start"}
      <span class="badge-caret"><CaretLeftIcon /></span>
    {/if}
    <bdi dir="ltr" class="badge-count bold">{sign}{count}</bdi>
    <span class="badge-label uppercase">{m.text_episodes_short()}</span>
    {#if side === "end"}
      <span class="badge-caret"><CaretRightIcon /></span>
    {/if}
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-episode-rail-count-label {
    --label-height: var(--ni-24);
    --label-width: var(--ni-56);
    --label-top: calc(
      var(--height-landscape-card-cover) / 2 - var(--label-width) / 2
    );

    position: absolute;
    top: var(--label-top);
    z-index: var(--layer-raised);

    opacity: 0;
    pointer-events: none;

    transition:
      top var(--transition-increment) ease-in-out,
      opacity var(--transition-increment) ease-in-out;

    &[data-visible="true"] {
      opacity: 1;
      pointer-events: auto;
    }

    &[data-side="start"] {
      inset-inline-start: var(--layout-distance-side);
    }

    &[data-side="end"] {
      inset-inline-end: var(--layout-distance-side);
    }

    /* In the strip the list reserves above the stills. */
    &[data-docked="false"] {
      --label-width: auto;
      top: 0;
    }

    :global(.trakt-link) {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      height: var(--ni-56);
      width: var(--ni-56);

      background: var(--color-background-cover-tag);
      backdrop-filter: blur(var(--ni-6));
      color: var(--shade-10);

      transition:
        height var(--transition-increment) ease-in-out,
        width var(--transition-increment) ease-in-out,
        padding var(--transition-increment) ease-in-out,
        border-radius var(--transition-increment) ease-in-out,
        background-color var(--transition-increment) ease-in-out;
    }

    &[data-docked="true"][data-side="start"] :global(.trakt-link) {
      border-start-end-radius: 999px;
      border-end-end-radius: 999px;
    }

    &[data-docked="true"][data-side="end"] :global(.trakt-link) {
      border-start-start-radius: 999px;
      border-end-start-radius: 999px;
    }

    /* Off the artwork the chip is a regular themed pill, not cover glass. */
    &[data-docked="false"] :global(.trakt-link) {
      flex-direction: row;
      gap: var(--gap-xxs);
      height: var(--label-height);
      width: var(--ni-80);
      padding: 0 var(--ni-8);
      border-radius: 999px;
      backdrop-filter: none;
      background: var(--color-background-default);
      color: var(--color-foreground-default);
    }

    @include for-mouse {
      &[data-docked="false"] :global(.trakt-link:hover) {
        background: var(--color-background-default-hover);
      }
    }

    :global(.trakt-link:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--shade-10);
      outline-offset: calc(-1 * var(--ni-4));
    }

    @include for-mouse {
      :global(.trakt-link:hover) {
        background: var(--color-background-cover-tag-hover);
      }
    }
  }

  .badge-count {
    font-size: var(--font-size-text);
    line-height: 1;
  }

  .badge-label {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--shade-10) 70%, transparent);
  }

  .badge-caret {
    display: none;

    :global(svg) {
      width: var(--ni-8);
      height: var(--ni-8);
    }
  }

  .trakt-episode-rail-count-label[data-docked="false"] {
    .badge-caret {
      display: flex;
    }

    .badge-count,
    .badge-label {
      font-size: var(--font-size-tag);
      color: inherit;
    }
  }
</style>
