<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TrackIcon from "$lib/components/TrackIcon.svelte";
  import { linear } from "svelte/easing";
  import { slide } from "svelte/transition";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation.ts";

  const { count, i18n }: { count: number; i18n: TagIntl } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  const transitionDuration = 300;
  // FIXME: replace the one in the tags folder when new design is leading
</script>

<watch-count-tag>
  <Link href={buildDrawerLink(Drawers.History)} noscroll>
    <StemTag
      --color-background-stem-tag="var(--shade-10)"
      --color-foreground-stem-tag="var(--shade-920)"
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
  </Link>
</watch-count-tag>

<style>
  watch-count-tag {
    :global(.trakt-tag) {
      position: relative;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    :global(.counter[inert]) {
      position: absolute;
      left: var(--ni-20);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
