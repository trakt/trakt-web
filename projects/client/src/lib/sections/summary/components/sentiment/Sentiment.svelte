<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import SentimentCard from "./_internal/SentimentCard.svelte";
  import { useMatch } from "./useMatch.ts";

  type SentimentProps = {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
    slug: string;
    id: number;
    variant?: ListVariant;
    type: MediaType;
  };

  const { sentiment, realityCheck, slug, id, variant, type }: SentimentProps =
    $props();

  const { match, isAvailable } = useMatch(fromRune(() => ({ type, id })));
</script>

{#if sentiment !== null || realityCheck !== null || $match !== null || $isAvailable}
  <SectionList
    id={{
      scope: `sentiment-list-${type}`,
      key: slug,
    }}
    items={[{ key: "sentiment" }]}
    title={m.header_insights()}
    {variant}
    --height-list="var(--height-sentiment-list)"
  >
    {#snippet item()}
      <SentimentCard {sentiment} {realityCheck} {type} {id} />
    {/snippet}
  </SectionList>
{/if}
