<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
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

  const { list, hasSpoilers } = $derived(
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

<RenderFor audience="authenticated">
  {#if $list.length > 0}
    <div class="trivia-list-container" transition:slide={{ duration: 150 }}>
      <SectionList
        id={`trivia-list-${media.slug}-${media.type}`}
        items={$list}
        title={m.list_title_trivia()}
        --height-list="var(--height-trivia-list)"
        metaInfo={$hasSpoilers ? metaInfo : undefined}
      >
        {#snippet badge()}
          {#if $hasSpoilers}
            <Toggler value={$triviaType.value} onChange={set} {options} />
          {/if}
        {/snippet}

        {#snippet item(trivia)}
          <TriviaCard {trivia} {media} />
        {/snippet}
      </SectionList>
    </div>
  {/if}
</RenderFor>
