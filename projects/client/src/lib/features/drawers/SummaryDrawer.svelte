<script lang="ts">
  import { page } from "$app/state";
  import {
    drawerNavigation,
    Drawers,
  } from "$lib/features/drawers/drawerNavigation";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import SentimentDrawer from "$lib/sections/summary/components/sentiment/SentimentDrawer.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis | Nil } = $props();

  const { drawer, close } = $derived(drawerNavigation(page.url.searchParams));
</script>

{#if drawer === Drawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}
