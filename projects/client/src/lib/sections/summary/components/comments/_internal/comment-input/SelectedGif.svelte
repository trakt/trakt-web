<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import type { SelectedGifProps } from "./SelectedGifProps.ts";

  const { gif, onRemove, disabled }: SelectedGifProps = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const source = $derived(
    $isReducedMotion && gif.stillUrl ? gif.stillUrl : gif.previewUrl,
  );
</script>

<div class="trakt-selected-gif">
  <img
    src={source}
    alt={m.image_alt_selected_gif()}
    width={gif.width}
    height={gif.height}
    decoding="async"
  />

  <div class="selected-gif-remove">
    <ActionButton
      onclick={onRemove}
      label={m.button_label_remove_gif()}
      type="button"
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

    display: flex;
    max-width: 100%;

    border-radius: var(--border-radius-s);
    overflow: hidden;

    img {
      display: block;

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
