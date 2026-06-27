<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEditMode } from "./useEditMode";

  const { exit } = useEditMode();
</script>

<div class="trakt-edit-mode-bar">
  <p class="secondary ellipsis">{m.text_edit_mode_toggle_sections()}</p>
  <Button
    label={m.button_label_exit_edit_mode()}
    size="small"
    color="purple"
    onclick={exit}
  >
    {m.button_text_exit_edit_mode()}
    {#snippet icon()}
      <CloseIcon />
    {/snippet}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-edit-mode-bar {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    background-color: var(--color-floating-background);
    border-radius: var(--ni-60);
    padding: var(--ni-8);
    padding-inline-start: var(--ni-16);

    box-shadow: var(--shadow-floating);

    :global(.trakt-button) {
      flex-direction: row-reverse;
      border-radius: var(--ni-60);
    }

    @include for-tablet-sm-and-below {
      box-shadow: none;
      border: var(--ni-1) solid
        color-mix(in srgb, var(--color-border) 75%, transparent);
    }
  }
</style>
