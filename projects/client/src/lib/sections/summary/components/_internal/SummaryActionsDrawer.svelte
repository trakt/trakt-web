<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { writable } from "svelte/store";

  const {
    children,
    title,
    metaInfo,
  }: {
    title: string;
    metaInfo?: string;
  } & ChildrenProps = $props();

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);
</script>

<div class="trakt-media-actions-button" class:is-opened={$isOpen}>
  <ActionButton
    label={m.button_label_popup_menu({ title })}
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
  >
    <MoreIcon />
  </ActionButton>
</div>

{#if $isOpen}
  <Drawer {onClose} {title} {metaInfo}>
    <div class="trakt-media-actions">
      {@render children()}
    </div>
  </Drawer>
{/if}

<style>
  .trakt-media-actions-button {
    :global(svg) {
      transition: transform var(--transition-increment) ease-in-out;
    }

    &.is-opened {
      :global(svg) {
        transform: rotate(90deg);
        animation: rotate-90 var(--transition-increment) ease-in;
      }
    }
  }

  .trakt-media-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
