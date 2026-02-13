<script lang="ts">
  import { page } from "$app/state";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis | Nil } = $props();

  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === Drawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}
