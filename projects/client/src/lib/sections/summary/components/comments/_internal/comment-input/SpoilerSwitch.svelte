<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  type SpoilerSwitchProps = {
    isChecked: boolean;
    onclick: (e: MouseEvent) => void;
    disabled?: boolean;
  };

  const { isChecked, onclick, disabled }: SpoilerSwitchProps = $props();
</script>

<div class="trakt-comment-spoiler">
  <p class="secondary bold" class:is-spoiler={isChecked}>
    {m.text_spoiler()}
  </p>
  <Switch
    label={m.switch_label_mark_as_spoiler()}
    color="red"
    checked={isChecked}
    {onclick}
    {disabled}
  />
</div>

<style>
  .trakt-comment-spoiler {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    p {
      transition: color var(--transition-increment) ease-in-out;

      &.is-spoiler {
        color: var(--red-500);
      }
    }
  }
</style>
