<script lang="ts">
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import type { MediaReactionsProps } from "./MediaReactionsProps.ts";
  import ReactionsCta from "./_internal/ReactionsCta.svelte";
  import ReactionsDrawer from "./_internal/ReactionsDrawer.svelte";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  const { type, slug, title }: MediaReactionsProps = $props();

  const summary = $derived(useMediaReactions({ type, slug }).summary);

  // The user's picked reaction. Null until they choose one; drives both the CTA
  // label and which forum the drawer opens to.
  let chosen = $state<ReactionSentiment | null>(null);
  let isOpen = $state(false);

  // Top 3 reactions by count, shown as the CTA preview before a pick is made.
  const topSentiments = $derived(
    [...summary.metrics]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((metric) => metric.sentiment),
  );
</script>

<ReactionsCta {topSentiments} {chosen} onclick={() => (isOpen = true)} />

{#if isOpen}
  <ReactionsDrawer
    {type}
    {slug}
    {title}
    {summary}
    {chosen}
    onSelect={(sentiment) =>
      (chosen = chosen === sentiment ? null : sentiment)}
    onClose={() => (isOpen = false)}
  />
{/if}
