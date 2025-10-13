<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import { useMediaSpoiler } from "$lib/features/spoilers/useMediaSpoiler";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import CollapsableContent from "./CollapsableContent.svelte";

  const { children, ...target }: ChildrenProps & MediaStoreProps = $props();

  const { isSpoilerHidden } = $derived(useMediaSpoiler(target));

  const labels = {
    view: "View description",
    hide: "Hide description",
  };

  // FIXME: i18n as design is finalized
</script>

{#snippet spoiler()}
  <CollapsableContent {labels} variant="contain">
    {@render children()}
    {#snippet headerContent()}
      <p class="meta-info trakt-spoiler-alert">Spoiler alert <DropIcon /></p>
    {/snippet}
  </CollapsableContent>
{/snippet}

{#if $isSpoilerHidden}
  {@render spoiler()}
{:else}
  {@render children()}
{/if}

<style>
  .trakt-spoiler-alert {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
