<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaReactionsProps } from "./MediaReactionsProps.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import ReactionGlyph from "./_internal/ReactionGlyph.svelte";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  /*
    The review card's react cluster - the add-reaction mark, the community's
    top picks, the count - carried over to media. One tap target: the whole
    badge routes to the reactions drawer, where reacting itself happens.
  */
  type MediaReactionsBadgeProps = Omit<MediaReactionsProps, "title"> & {
    link: {
      href: string;
      noscroll?: boolean;
      replacestate?: boolean;
    };
  };

  const { type, slug, link }: MediaReactionsBadgeProps = $props();

  const summary = $derived(useMediaReactions({ type, slug }).summary);

  const topSentiments = $derived(
    [...summary.metrics]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((metric) => metric.sentiment),
  );
</script>

<div class="trakt-media-reactions-badge">
  <Link
    href={link.href}
    noscroll={link.noscroll}
    replacestate={link.replacestate}
    color="inherit"
    label={m.reactions_cta_label()}
  >
    <span class="badge-mark" aria-hidden="true">
      <ReactionIcon state="add" />
    </span>

    {#if topSentiments.length > 0}
      <span class="badge-glyphs" aria-hidden="true">
        {#each topSentiments as sentiment, index (sentiment)}
          <span
            class="badge-glyph"
            style:z-index={topSentiments.length - index}
          >
            <ReactionGlyph {sentiment} />
          </span>
        {/each}
      </span>
    {/if}

    {#if summary.totalCount > 0}
      <span class="badge-count bold">
        {toHumanNumber(summary.totalCount, getLocale())}
      </span>
    {/if}
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-media-reactions-badge {
    :global(.trakt-link) {
      text-decoration: none;

      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);

      height: var(--ni-36);
      box-sizing: border-box;
      padding: var(--ni-4) var(--ni-12);

      border-radius: var(--border-radius-xxl);
      background: var(--color-reaction-background);

      transition: background-color var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      :global(.trakt-link:hover) {
        background: var(--color-reaction-background-hover);
      }
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    .badge-mark {
      display: inline-flex;
      align-items: center;
    }

    .badge-glyphs {
      display: inline-flex;
      align-items: center;

      --reaction-glyph-size: var(--ni-16);
    }

    /* Overlapped like the review cluster - a stack, not a queue. */
    .badge-glyph + .badge-glyph {
      margin-inline-start: calc(-1 * var(--ni-5));
    }

    .badge-count {
      font-size: var(--font-size-text-small);
      color: var(--color-text-primary);
    }
  }
</style>
