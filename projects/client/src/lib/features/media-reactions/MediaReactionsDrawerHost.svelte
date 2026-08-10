<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import ReactionsDrawer from "./_internal/ReactionsDrawer.svelte";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  /*
    The reactions drawer, reachable by URL rather than only through the CTA.

    MediaReactions opens the same drawer from its own pill and owns the chosen
    state for that flow; this host exists for surfaces that link straight to
    reactions - the summary header's glance strip - where there is no pill to
    click first.
  */
  const {
    type,
    slug,
    title,
    onClose,
  }: {
    type: MediaType;
    slug: string;
    title: string;
    onClose: () => void;
  } = $props();

  const summary = $derived(useMediaReactions({ type, slug }).summary);

  let chosen = $state<ReactionSentiment | null>(null);
</script>

<ReactionsDrawer
  {type}
  {slug}
  {title}
  {summary}
  {chosen}
  onSelect={(sentiment) => (chosen = chosen === sentiment ? null : sentiment)}
  onClose={onClose}
/>
