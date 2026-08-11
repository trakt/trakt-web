<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";

  /*
    The header's sentiment language, at drawer depth: hairline bands with
    letterspaced caps labels instead of the framed cards this used to stack.
    Verdict prose first, the highlight as the one primary-weight statement,
    then what reviewers praise and pan as counted, dotted lists - the same
    dots the header's sentiment column wears.
  */
  const { sentiment }: { sentiment: SentimentAnalysis } = $props();

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

<div class="trakt-sentiment-content">
  <section class="sentiment-band">
    <h3 class="band-label">{m.text_sentiment_the_verdict()}</h3>
    <p class="band-prose">{sentiment.analysis}</p>
  </section>

  {#if sentiment.highlight}
    <section class="sentiment-band">
      <h3 class="band-label">{m.header_sentiment_highlight()}</h3>
      <p class="band-prose band-highlight">{sentiment.highlight}</p>
    </section>
  {/if}

  {#if pros.length > 0}
    <section class="sentiment-band">
      <h3 class="band-label band-label-good">
        {m.header_sentiment_working()}
        <span class="band-count">{pros.length}</span>
      </h3>
      {@render aspects(pros, "good")}
    </section>
  {/if}

  {#if cons.length > 0}
    <section class="sentiment-band">
      <h3 class="band-label band-label-bad">
        {m.header_sentiment_not_working()}
        <span class="band-count">{cons.length}</span>
      </h3>
      {@render aspects(cons, "bad")}
    </section>
  {/if}
</div>

<style lang="scss">
  .trakt-sentiment-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    font-size: var(--font-size-text);
  }

  .sentiment-band {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    &:not(:first-child) {
      padding-top: var(--ni-24);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }

  .band-label {
    margin: 0;

    display: flex;
    align-items: baseline;
    gap: var(--gap-s);

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

  .band-count {
    color: var(--color-text-secondary);
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
    border-radius: 999px;

    background: var(--aspect-color);
  }

  .aspect-text {
    color: var(--color-text-secondary);
  }
</style>
