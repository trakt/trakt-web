<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { stripMarkdownLinks } from "$lib/utils/markdown/stripMarkdownLinks.ts";
  import { toSentimentAspects } from "$lib/utils/sentiment/toSentimentAspects.ts";
  import TodaySentimentVerdict from "./_internal/TodaySentimentVerdict.svelte";

  const ASPECTS_LIMIT = 4;

  const {
    sentiment,
    highlightLines = 3,
    variant = "full",
  }: {
    sentiment: SentimentAnalysis;
    highlightLines?: number;
    variant?: "full" | "headline";
  } = $props();

  const isHeadline = $derived(variant === "headline");

  const selected = $derived(
    sentiment.aspect.pros.length + sentiment.aspect.cons.length > 0
      ? toSentimentAspects({
          pros: sentiment.aspect.pros,
          cons: sentiment.aspect.cons,
          limit: ASPECTS_LIMIT,
        })
      : null,
  );
  const verdict = $derived(selected?.verdict ?? null);
  const aspects = $derived(
    selected
      ? [
          { key: "good" as const, items: selected.pros },
          { key: "bad" as const, items: selected.cons },
        ].filter((aspect) => aspect.items.length > 0)
      : [],
  );
</script>

<div class="trakt-today-sentiment-insights" data-variant={variant}>
  <div class="insights-header">
    <p class="tag uppercase bold insights-kicker">
      {m.header_community_sentiment()}
    </p>
    {#if verdict}
      <TodaySentimentVerdict {verdict} />
    {/if}
  </div>
  {#if !isHeadline}
    <p class="small" use:lineClamp={{ lines: highlightLines }}>
      {stripMarkdownLinks(sentiment.highlight)}
    </p>
  {/if}

  {#each isHeadline ? [] : aspects as aspect (aspect.key)}
    <div class="insights-aspects" data-sentiment={aspect.key}>
      <SentimentIcon sentiment={aspect.key} />
      <ul>
        {#each aspect.items as item, index (index)}
          <li><p class="small capitalize ellipsis">{item}</p></li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-today-sentiment-insights {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    p {
      margin: 0;
    }

    .insights-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .insights-kicker {
      color: var(--color-text-emphasis);
    }

    .insights-aspects {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-xs);

      color: var(--color-sentiment-good);

      &[data-sentiment="bad"] {
        color: var(--color-sentiment-bad);
      }

      :global(svg) {
        flex-shrink: 0;
        width: var(--ni-16);
        height: var(--ni-16);
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--gap-xxs);
        min-width: 0;

        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        min-width: 0;
        color: var(--color-text-primary);
      }
    }
  }
</style>
