<script lang="ts">
  import ReactionsPopup from "$lib/components/reactions/ReactionsPopup.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import ReactionsDrawer from "./ReactionsDrawer.svelte";
  import ReactionsPopoverContent from "./ReactionsPopoverContent.svelte";
  import type { ReactionsPopoverProps } from "./ReactionsPopoverProps.ts";

  const { trigger: badge, ...content }: ReactionsPopoverProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);

  let isDrawerOpen = $state(false);

  function openDrawer(close: () => void) {
    close();
    isDrawerOpen = true;
  }
</script>

<ReactionsPopup reserve="var(--ni-252)" offset="var(--ni-8)">
  {#snippet trigger(attach, isOpened)}
    <button
      type="button"
      class="trakt-reactions-popover-trigger"
      use:attach
      aria-label={m.button_label_popup_reactions()}
      aria-expanded={isOpened}
    >
      {@render badge()}
    </button>
  {/snippet}

  {#snippet children(close)}
    <ReactionsPopoverContent
      {...content}
      {close}
      onMore={$isMobile || $isTabletSmall ? () => openDrawer(close) : undefined}
    />
  {/snippet}
</ReactionsPopup>

{#if isDrawerOpen}
  <ReactionsDrawer
    chosen={content.chosen}
    onSelect={content.onSelect}
    onClose={() => (isDrawerOpen = false)}
  />
{/if}

<style lang="scss">
  .trakt-reactions-popover-trigger {
    all: unset;

    display: inline-flex;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
      border-radius: var(--border-radius-xxl);
    }
  }
</style>
