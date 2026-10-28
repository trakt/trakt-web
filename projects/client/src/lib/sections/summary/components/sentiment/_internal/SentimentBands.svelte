<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import { toSummarySentiment } from "../../header-kit/toSummarySentiment.ts";

  /*
    The header's sentiment language, at drawer depth: the verdict pill answers
    first, then hairline bands with letterspaced caps labels instead of framed
    cards. The highlight leads - one primary-weight line worth reading on its
    own - then the verdict prose, then what reviewers praise and pan as dotted
    lists with the same dots the header's sentiment column wears. The rules
    key on position, so a title with no highlight simply opens on the verdict.
  */
  const { sentiment }: { sentiment: SentimentAnalysis } = $props();

  const verdict = $derived(toSummarySentiment(sentiment));
  const pros = $derived(sentiment.aspect.pros);
  const cons = $derived(sentiment.aspect.cons);
</script>

{#snippet aspects(items: string[], flavor: "good" | "bad")}
  <ul class="sentiment-aspects" data-flavor={flavor}>
    {#each items as aspect (aspect)}
      <li>
        <span class="aspect-marker" aria-hidden="true">
          <span class="aspect-dot"></span>
        </span>
        <span class="aspect-text">{aspect}</span>
      </li>
    {/each}
  </ul>
{/snippet}

<div class="trakt-sentiment-bands">
  {#if verdict}
    <span class="sentiment-verdict" data-verdict={verdict.verdict}>
      {verdict.label}
    </span>
  {/if}

  {#if sentiment.highlight}
    <section class="sentiment-band">
      <h3 class="band-label">{m.header_sentiment_highlight()}</h3>
      <p class="band-prose band-highlight">
        <InlineMarkdown text={sentiment.highlight} />
      </p>
    </section>
  {/if}

  <section class="sentiment-band">
    <h3 class="band-label">{m.text_sentiment_the_verdict()}</h3>
    <p class="band-prose"><InlineMarkdown text={sentiment.analysis} /></p>
  </section>

  {#if pros.length > 0}
    <section class="sentiment-band">
      <h3 class="band-label band-label-good">{m.header_sentiment_working()}</h3>
      {@render aspects(pros, "good")}
    </section>
  {/if}

  {#if cons.length > 0}
    <section class="sentiment-band band-joined">
      <h3 class="band-label band-label-bad">
        {m.header_sentiment_not_working()}
      </h3>
      {@render aspects(cons, "bad")}
    </section>
  {/if}
</div>

<style lang="scss">
  .trakt-sentiment-bands {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    padding-block: var(--gap-xs) var(--gap-s);

    font-size: var(--font-size-text);
  }

  /* The summary screen's own verdict pill - one system, everywhere. */
  .sentiment-verdict {
    align-self: flex-start;
    display: inline-flex;

    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--border-radius-pill);

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    color: var(--sentiment-color);
    background: color-mix(in srgb, var(--sentiment-color) 16%, transparent);

    &[data-verdict="positive"] {
      --sentiment-color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      --sentiment-color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      --sentiment-color: var(--red-400);
    }
  }

  .sentiment-band {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    &:not(:first-child) {
      padding-top: var(--ni-24);
      border-top: var(--ni-1) solid var(--color-hairline);
    }

    /* The pill opens the drawer; the first band follows it without a rule. */
    .sentiment-verdict + & {
      padding-top: 0;
      border-top: none;
    }

    /* Pros and cons are one conversation - no rule between them. */
    &.band-joined {
      padding-top: var(--ni-8);
      border-top: none;
    }
  }

  .band-label {
    margin: 0;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    &.band-label-good {
      color: var(--green-400);
    }

    &.band-label-bad {
      color: var(--red-400);
    }
  }

  .band-prose {
    margin: 0;

    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  /* The one statement worth full weight - everything else stays quiet. */
  .band-highlight {
    color: var(--color-text-primary);
  }

  .sentiment-aspects {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-s);
    }

    &[data-flavor="good"] {
      --aspect-color: var(--green-400);
    }

    &[data-flavor="bad"] {
      --aspect-color: var(--red-400);
    }
  }

  /*
    The marker box spans the first text line's height so the dot centres on
    it optically - the header's sentiment column solved this the same way.
  */
  .aspect-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: calc(var(--font-size-text) * 1.5);
  }

  .aspect-dot {
    width: var(--ni-6);
    height: var(--ni-6);
    border-radius: var(--border-radius-pill);

    background: var(--aspect-color);
  }

  /* Matches the marker box height, so the dot centres on the first line. */
  .aspect-text {
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
</style>
