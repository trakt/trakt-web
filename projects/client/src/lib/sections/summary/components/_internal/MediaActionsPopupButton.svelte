<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import * as m from "$lib/features/i18n/messages";

  const {
    title,
    isOpen,
    onToggle,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
  } = $props();
</script>

<div class="trakt-media-actions-popup-button" class:is-opened={isOpen}>
  <ActionButton
    label={m.button_label_popup_menu({ title })}
    onclick={onToggle}
    style="ghost"
  >
    <MoreIcon />
  </ActionButton>
</div>

<style>
  .trakt-media-actions-popup-button {
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
</style>
