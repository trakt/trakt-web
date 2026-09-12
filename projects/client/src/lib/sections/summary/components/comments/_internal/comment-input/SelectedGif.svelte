<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SelectedGifProps } from "./SelectedGifProps.ts";

  const { gif, onRemove, disabled }: SelectedGifProps = $props();
</script>

<div class="trakt-selected-gif">
  <img src={gif.previewUrl} alt={m.image_alt_selected_gif()} />

  <div class="selected-gif-remove">
    <ActionButton
      onclick={onRemove}
      label={m.button_label_remove_gif()}
      style="ghost"
      color="red"
      size="small"
      variant="secondary"
      {disabled}
    >
      <CloseIcon />
    </ActionButton>
  </div>
</div>

<style lang="scss">
  .trakt-selected-gif {
    position: relative;
    align-self: flex-start;

    // Hugs the gif rather than the composer, so the remove button stays on the
    // corner of a portrait gif as well as a landscape one.
    display: flex;
    max-width: 100%;

    border-radius: var(--border-radius-s);
    overflow: hidden;

    img {
      display: block;

      // Boxed on both axes, or a portrait gif towers over the field it is
      // being written into.
      width: auto;
      height: auto;
      max-width: var(--ni-160);
      max-height: var(--ni-160);

      background-color: var(--color-input-background);
    }

    .selected-gif-remove {
      position: absolute;
      inset-block-start: var(--ni-4);
      inset-inline-end: var(--ni-4);

      border-radius: 50%;
      background-color: var(--color-background-select);
    }
  }
</style>
