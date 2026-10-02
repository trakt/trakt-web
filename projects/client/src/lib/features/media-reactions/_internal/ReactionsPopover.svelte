<script lang="ts">
  import ReactionsPopup from "$lib/components/reactions/ReactionsPopup.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionsPopoverContent from "./ReactionsPopoverContent.svelte";
  import type { ReactionsPopoverProps } from "./ReactionsPopoverProps.ts";

  const { trigger: badge, ...content }: ReactionsPopoverProps = $props();
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
    <ReactionsPopoverContent {...content} {close} />
  {/snippet}
</ReactionsPopup>

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
