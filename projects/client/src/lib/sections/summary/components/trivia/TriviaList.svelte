<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { slide } from "svelte/transition";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const CHARACTER_WIDTH_FACTOR = 0.85;

  const { media }: { media: MediaEntry } = $props();

  const { current: triviaType, set, options } = useToggler("trivia");

  const longestOptionLength = $derived(
    Math.max(...options.map((option) => option.text().length)),
  );

  const { list, summary, hasSpoilers } = $derived(
    useTrivia({
      slug: media.slug,
      type: media.type,
      variant: $triviaType.value,
    }),
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo
    text={$triviaType.text()}
    --meta-info-width={`${longestOptionLength * CHARACTER_WIDTH_FACTOR}ch`}
  />
{/snippet}

{#snippet triviaList(items: MediaTrivia[], isVip = false)}
  {#snippet actions()}
    <Toggler value={$triviaType.value} onChange={set} {options} />
  {/snippet}

  {#if items.length > 0}
    <div class="trivia-list-container" transition:slide={{ duration: 150 }}>
      <SectionList
        id={`trivia-list-${media.slug}-${media.type}`}
        {items}
        title={m.list_title_trivia()}
        --height-list="var(--height-trivia-list)"
        metaInfo={isVip && $hasSpoilers ? metaInfo : undefined}
        actions={isVip && $hasSpoilers ? actions : undefined}
      >
        {#snippet item(trivia)}
          <TriviaCard
            {trivia}
            {media}
            variant={isVip ? undefined : "summary"}
          />
        {/snippet}
      </SectionList>
    </div>
  {/if}
{/snippet}

<RenderFor audience="free">
  {@render triviaList($summary)}
</RenderFor>

<RenderFor audience="vip">
  {@render triviaList($list, true)}
</RenderFor>
