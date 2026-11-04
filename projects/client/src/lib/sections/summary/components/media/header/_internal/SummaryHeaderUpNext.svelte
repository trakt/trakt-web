<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";
  import { toProgressOutlook } from "./toProgressOutlook.ts";

  /*
    The Progress column's body: what to watch next, with a mark-watched beside
    it, then the episode seen last - its number, name and synopsis - as a way
    back into where the story stands. How far through the show the viewer is
    already sits on the column's subline.
  */
  const {
    progress,
    show,
  }: {
    progress: EpisodeProgressEntry;
    show: { id: number; title: string; slug: string };
  } = $props();

  const outlook = $derived(toProgressOutlook(progress));

  /*
    The synopsis takes whatever height the strip's tallest column leaves it
    and shows as many whole lines as fit there. Its box never grows with its
    text (see `contain: size`), so resizing it to clamp cannot loop.
  */
  const fitLines = (node: HTMLElement) => {
    const observer = new ResizeObserver(([entry]) => {
      const lineHeight = parseFloat(getComputedStyle(node).lineHeight);
      if (!entry || !lineHeight) return;

      const lines = Math.max(
        1,
        Math.floor(entry.contentRect.height / lineHeight),
      );
      node.style.setProperty("--previous-overview-lines", String(lines));
    });

    observer.observe(node);
    return () => observer.disconnect();
  };
</script>

<div class="trakt-summary-header-up-next">
  {#if outlook.next}
    <div class="up-next-row">
      <div class="up-next-text">
        <SummaryHeaderLabel text={outlook.next.kicker} />
        <span class="up-next-episode">{outlook.next.label}</span>
      </div>

      <MarkAsWatchedAction
        mode="hybrid"
        style="action"
        type="episode"
        size="small"
        title={outlook.next.label}
        {show}
        media={progress}
      />
    </div>
  {/if}

  {#if outlook.previous}
    <div class="previous-row">
      <Link
        color="inherit"
        href={UrlBuilder.episodeDrawer(
          show.slug,
          outlook.previous.season,
          outlook.previous.number,
        )}
      >
        <SummaryHeaderLabel text={outlook.previous.kicker} />

        <span class="previous-heading">
          <span class="previous-title">{outlook.previous.title ?? ""}</span>
          <span class="previous-caret" aria-hidden="true">
            <CaretRightIcon />
          </span>
        </span>

        {#if outlook.previous.overview}
          <span class="previous-overview-slot" {@attach fitLines}>
            <span class="previous-overview">{outlook.previous.overview}</span>
          </span>
        {/if}
      </Link>
    </div>
  {/if}
</div>

<style lang="scss">
  /*
    Grows to the bottom of the column, which the strip stretches to its
    tallest neighbour - that height is the synopsis's budget.
  */
  .trakt-summary-header-up-next {
    display: flex;
    flex-direction: column;
    gap: var(--summary-header-row-gap, var(--ni-12));

    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .up-next-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    min-height: var(--summary-header-row-height, var(--ni-44));
    box-sizing: border-box;
  }

  .up-next-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    flex: 1;
    min-width: 0;
  }

  /* Sized on the span: the global sheet sets every bare span to 14px. */
  .up-next-episode {
    font-size: var(--ni-16);
    font-weight: 700;
    line-height: var(--ni-20);
    color: var(--color-text-primary);
  }

  .previous-row {
    display: flex;
    flex-direction: column;

    flex: 1 1 auto;
    min-height: 0;
  }

  /*
    The whole row is the way in, lit like the provider rows beside it: a soft
    wash on hover, padding traded for negative margin so the words stay flush
    with the column.
  */
  .previous-row :global(a) {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    flex: 1 1 auto;
    min-height: var(--summary-header-row-height, var(--ni-44));
    padding: var(--ni-4) var(--ni-8);
    margin: calc(-1 * var(--ni-4)) calc(-1 * var(--ni-8));
    box-sizing: border-box;
    border-radius: var(--border-radius-m);

    text-decoration: none;
    transition: background-color var(--transition-increment) ease-out;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 5%,
          transparent
        );
      }
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .previous-row:hover .previous-caret {
      opacity: 0.9;
    }
  }

  /* The caret rides the name's line, so a long synopsis never drags it down. */
  .previous-heading {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .previous-title {
    flex: 1;
    min-width: 0;

    font-size: var(--font-size-text);
    font-weight: 700;
    line-height: var(--ni-20);
    color: var(--color-text-primary);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*
    The slot takes the leftover height; the text inside is clamped to the
    whole lines that fit, so its own box ends on the last full line and no
    sliver of the next one shows under the ellipsis.
  */
  .previous-overview-slot {
    flex: 1 1 0;
    min-height: var(--ni-16);
    contain: size;
    overflow: hidden;

    font-size: var(--font-size-text-small);
    line-height: var(--ni-16);
  }

  .previous-overview {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--previous-overview-lines, 1);
    line-clamp: var(--previous-overview-lines, 1);
    overflow: hidden;

    font-size: inherit;
    line-height: inherit;
  }

  /*
    Two classes deep on purpose: Link sets every span inside it to inherit
    its colour, which would turn the label and the synopsis white.
  */
  .previous-row {
    :global(.trakt-summary-header-label) {
      color: var(--summary-header-label-color, var(--color-text-quiet));
    }

    .previous-overview {
      color: var(--color-text-quiet);
    }
  }

  /* The section header's caret: the label's size, quiet until hovered. */
  .previous-caret {
    flex: none;
    display: inline-flex;
    align-items: center;

    font-size: var(--font-size-text-small);
    color: var(--color-text-primary);
    opacity: 0.55;
    transition: opacity var(--transition-increment) ease-out;

    :global(svg) {
      height: 1em;
      width: auto;
    }
  }
</style>
