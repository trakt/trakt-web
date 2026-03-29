<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import { mapToSentimentSummary } from "./mapToSentimentSummary";

  type SentimentProps = {
    pros: string[];
    cons: string[];
  };

  const { pros, cons }: SentimentProps = $props();

  const { aspects, text } = $derived(mapToSentimentSummary({ pros, cons }));
</script>

<div class="trakt-sentiment-summary">
  <span class="capitalize bold">{text}</span>

  <div class="trakt-sentiment-aspects">
    <ul>
      {#each aspects as aspect}
        <li><p class="capitalize">{aspect}</p></li>
      {/each}
    </ul>
  </div>

  <div class="trakt-sentiment-footer">
    <ArrowRightIcon />
  </div>
</div>

<style>
  .trakt-sentiment-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-s);

    height: 100%;
    width: 100%;

    overflow: hidden;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;
    padding-left: var(--ni-18);

    font-size: var(--font-size-text);

    color: color-mix(in srgb, var(--color-text-secondary) 50%, transparent);

    p.capitalize {
      color: var(--color-text-primary);
    }
  }

  .trakt-sentiment-aspects {
    display: flex;
    gap: var(--gap-s);

    color: var(--color-text-primary);
  }

  .trakt-sentiment-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
