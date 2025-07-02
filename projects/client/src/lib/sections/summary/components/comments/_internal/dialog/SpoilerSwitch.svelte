<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  type SpoilerSwitchProps = {
    isReplying: boolean;
    enabled: boolean;
    onclick: (e: MouseEvent) => void;
  };

  const { isReplying, enabled, onclick }: SpoilerSwitchProps = $props();
</script>

<div class="trakt-comment-spoiler">
  <p class="secondary meta-info" class:is-spoiler={enabled}>
    {m.text_spoiler()}
  </p>
  <Switch
    label={m.switch_label_mark_as_spoiler()}
    color="red"
    disabled={isReplying}
    checked={enabled}
    {onclick}
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
