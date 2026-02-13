<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";

  const KEYWORD_LIMIT = 3;

  type SentimentProps = {
    pros: string[];
    cons: string[];
    limit?: number;
  };

  const { pros, cons, limit = KEYWORD_LIMIT }: SentimentProps = $props();

  const isPartial = $derived(pros.length === 0 || cons.length === 0);

  const mappedSentiments = $derived([
    {
      aspects: pros.slice(0, limit),
      sentiment: "good" as const,
      sentimentColor: "var(--color-sentiment-good)",
    },
    {
      aspects: cons.slice(0, limit),
      sentiment: "bad" as const,
      sentimentColor: "var(--color-sentiment-bad)",
    },
  ]);
</script>

<div class="trakt-sentiment-body">
  {#each mappedSentiments as { sentiment, aspects, sentimentColor }, index (sentiment)}
    {#if aspects.length > 0}
      <div
        class="trakt-sentiment-container"
        style="--sentiment-color: {sentimentColor}"
        data-index={!isPartial ? index : undefined}
      >
        <SentimentIcon {sentiment} />
        <ul>
          {#each aspects as aspect}
            <li><p class="capitalize">{aspect}</p></li>
          {/each}
        </ul>
      </div>
    {/if}
  {/each}
</div>

<style>
  .trakt-sentiment-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    height: 100%;
    width: 100%;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;

    font-size: var(--font-size-text);

    list-style-type: none;
  }

  .trakt-sentiment-container {
    flex: 1 1 0;

    display: flex;
    gap: var(--gap-s);
    align-items: flex-start;

    color: var(--color-text-primary);

    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);
    padding: var(--ni-16);

    :global(svg) {
      flex-shrink: 0;
      color: var(--sentiment-color);
    }

    &[data-index="0"] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &[data-index="1"] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
</style>
