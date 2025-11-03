<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMediaSpoiler } from "$lib/features/spoilers/useMediaSpoiler";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { writable } from "svelte/store";
  import CollapsableContent from "./CollapsableContent.svelte";

  const { children, ...target }: ChildrenProps & MediaStoreProps = $props();

  const { isSpoilerHidden } = $derived(useMediaSpoiler(target));

  const labels = {
    view: m.button_text_view_description(),
    hide: m.button_text_hide_description(),
  };

  const isCollapsed = writable(true);
  const toggle = () => {
    isCollapsed.update((v) => !v);
  };
</script>

{#snippet spoiler()}
  <CollapsableContent
    {labels}
    variant="contain"
    isCollapsed={$isCollapsed}
    {toggle}
  >
    {@render children()}
    {#snippet headerContent()}
      <p class="meta-info trakt-spoiler-alert">
        {m.text_spoiler_alert()}
        <DropIcon />
      </p>
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
