<script lang="ts">
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { linear } from "svelte/easing";
  import { slide } from "svelte/transition";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation.ts";

  const {
    count,
    i18n,
    onclick,
  }: { count: number; i18n: TagIntl; onclick?: () => void } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  const transitionDuration = 300;
  // FIXME: replace the one in the tags folder when new design is leading
</script>

{#snippet tag()}
  <StemTag
    --color-background-stem-tag="var(--color-background-indicator-tag)"
    --color-foreground-stem-tag="var(--color-text-indicator-tag)"
  >
    <TrackIcon />

    <p class="bold uppercase no-wrap">{i18n.watchedLabel()}</p>
    {#if count > 1}
      <p class="bold">·</p>
      <div transition:slide={{ axis: "x", duration: 150 }}>
        {#key count}
          <p
            class="bold uppercase no-wrap counter"
            transition:slide={{
              easing: linear,
              axis: "y",
              duration: transitionDuration,
            }}
          >
            {count}
          </p>
        {/key}
      </div>
    {/if}
  </StemTag>
{/snippet}

<watch-count-tag>
  {#if onclick}
    <button type="button" class="watch-count-trigger" {onclick}>
      {@render tag()}
    </button>
  {:else}
    <Link {...buildDrawerLink(SummaryDrawers.History)}>
      {@render tag()}
    </Link>
  {/if}
</watch-count-tag>

<style>
  watch-count-tag {
    .watch-count-trigger {
      all: unset;
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
    }

    :global(.trakt-tag) {
      position: relative;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    :global(.counter[inert]) {
      position: absolute;
      inset-inline-start: var(--ni-20);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
