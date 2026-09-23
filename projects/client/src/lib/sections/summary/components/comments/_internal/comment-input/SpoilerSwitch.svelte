<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  type SpoilerSwitchProps = {
    isChecked: boolean;
    onclick: (e: MouseEvent) => void;
    disabled?: boolean;
    size?: "normal" | "small";
  };

  const {
    isChecked,
    onclick,
    disabled,
    size = "normal",
  }: SpoilerSwitchProps = $props();
</script>

<div class="trakt-comment-spoiler" data-size={size}>
  <p
    class="secondary bold"
    class:tag={size === "small"}
    class:is-spoiler={isChecked}
  >
    {m.text_spoiler()}
  </p>
  <span class="spoiler-switch-control">
    <Switch
      label={m.switch_label_mark_as_spoiler()}
      color="red"
      checked={isChecked}
      {onclick}
      {disabled}
    />
  </span>
</div>

<style>
  .trakt-comment-spoiler {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    .spoiler-switch-control {
      display: flex;
    }

    p {
      transition: color var(--transition-increment) ease-in-out;

      &.is-spoiler {
        color: var(--red-500);
      }
    }

    &[data-size="small"] {
      gap: var(--gap-xxs);

      .spoiler-switch-control {
        zoom: 0.75;
      }
    }
  }
</style>
