<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import type { SentimentVerdict } from "$lib/utils/sentiment/SentimentVerdict.ts";
  import { toTranslatedSentimentVerdict } from "$lib/utils/formatting/string/toTranslatedSentimentVerdict.ts";

  const { verdict }: { verdict: SentimentVerdict } = $props();

  const text = $derived(toTranslatedSentimentVerdict(verdict));
</script>

<div class="trakt-today-sentiment-verdict" data-verdict={verdict}>
  {#if verdict !== "negative"}
    <SentimentIcon sentiment="good" />
  {/if}
  {#if verdict !== "positive"}
    <SentimentIcon sentiment="bad" />
  {/if}
  <span class="bold uppercase">{text}</span>
</div>

<style lang="scss">
  .trakt-today-sentiment-verdict {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--gap-xxs);

    padding: var(--ni-4) var(--ni-10);
    white-space: nowrap;
    border-radius: var(--border-radius-xxl);

    background: color-mix(in srgb, currentColor 16%, transparent);
    color: var(--color-text-secondary);

    span {
      color: inherit;
      font-size: var(--font-size-tag);
    }

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &[data-verdict="positive"] {
      color: var(--color-sentiment-good);
    }

    &[data-verdict="negative"] {
      color: var(--color-sentiment-bad);
    }
  }
</style>
