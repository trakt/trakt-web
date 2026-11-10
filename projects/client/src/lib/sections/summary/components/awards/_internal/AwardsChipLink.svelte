<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
  import LaurelIcon from "$lib/components/icons/LaurelIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import Link from "$lib/components/link/Link.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import type { AwardsChipLinkProps } from "./AwardsChipLinkProps.ts";

  const {
    count,
    text,
    isLive,
    isWin,
    size = "normal",
    align = "start",
  }: AwardsChipLinkProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Awards));
  const label = $derived(
    m.aria_label_awards_badge({
      label: count == null ? text : `${count} ${text}`,
    }),
  );
</script>

<Link
  href={drawerLink.href}
  noscroll={drawerLink.noscroll}
  replacestate={drawerLink.replacestate}
  {label}
  color="inherit"
  underline="none"
>
  <span
    class="trakt-awards-chip"
    class:is-live={isLive}
    data-state={isWin ? "winner" : "nominee"}
    data-size={size}
    data-align={align}
  >
    {#if isLive}
      <ThreadRing color="gold" />
    {/if}
    <LaurelIcon />
    {#if count != null}
      <span class="chip-count bold">{count}</span>
    {/if}
    <span>{text}</span>
  </span>
</Link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-awards-chip {
    --awards-chip-icon-color: var(--color-award-gold);
    --awards-chip-count-color: var(--color-text-primary);

    position: relative;
    isolation: isolate;
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    height: var(--ni-32);
    padding-inline: var(--ni-10) var(--ni-12);

    border-radius: var(--border-radius-pill);
    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);
    white-space: nowrap;

    transition: background-color var(--transition-increment) ease-in-out;

    :global(svg) {
      flex: none;
      width: var(--ni-20);
      height: var(--ni-20);
      color: var(--awards-chip-icon-color);
    }

    .chip-count {
      color: var(--awards-chip-count-color);
      font-size: var(--font-size-text);
    }

    &[data-state="nominee"] {
      --awards-chip-icon-color: var(--color-award-nominee);
    }

    &[data-size="small"] {
      display: flex;
      height: auto;
      padding-block: var(--ni-4);
      margin-block: calc(-1 * var(--ni-4));

      :global(svg) {
        margin-block: calc(-1 * var(--ni-2));
      }
      color: var(--color-text-primary);

      &:not(.is-live)[data-align="start"] {
        margin-inline-start: calc(-1 * var(--ni-10));
      }
    }

    &.is-live {
      --awards-chip-icon-color: var(--color-award-gold);
      --awards-chip-count-color: var(--color-award-gold-text);

      background: var(--background-award-chip-live);
      box-shadow: var(--shadow-award-chip-live);
      color: var(--color-text-primary);
    }

    @include for-mouse {
      :global(.trakt-link:hover) &:not(.is-live),
      :global(.trakt-link:focus-visible) &:not(.is-live) {
        background: var(--color-award-chip-hover);
      }
    }
  }
</style>
