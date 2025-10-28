<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import SentimentsCard from "./_internal/SentimentsCard.svelte";

  const { sentiments, slug }: { sentiments: Sentiments | Nil; slug: string } =
    $props();
</script>

{#if sentiments}
  <SectionList
    id={`community-sentiments-${slug}`}
    items={[{ ...sentiments, key: "sentiment" }]}
    title={m.header_community_sentiment()}
    --height-list="var(--height-comments-list)"
  >
    {#snippet item(sentiments)}
      <SentimentsCard {sentiments} />
    {/snippet}
  </SectionList>
{/if}
