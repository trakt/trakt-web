<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { fade } from "svelte/transition";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const characterWidthFactor = 0.85;

  const { media, onClose }: { media: MediaEntry; onClose: () => void } =
    $props();

  let isOpen = $state(false);

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
    --meta-info-width={`${longestOptionLength * characterWidthFactor}ch`}
  />
{/snippet}

{#snippet badge()}
  <Toggler value={$triviaType.value} onChange={set} {options} />
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_trivia()}
  variant="vip"
  size="auto"
  metaInfo={$hasSpoilers ? metaInfo : undefined}
  badge={$hasSpoilers ? badge : undefined}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        <div class="trivia-drawer-list">
          {#each $list as trivia (trivia.key)}
            <TriviaCard {trivia} {media} />
          {/each}
        </div>
      </RenderFor>

      <RenderFor audience="free">
        <UpsellCta source="trivia">
          {m.vip_feature_description_trivia()}
        </UpsellCta>
      </RenderFor>
    </div>
  {/if}
</Drawer>

<style>
  .trivia-drawer-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-2);
  }
</style>
