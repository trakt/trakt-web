<script lang="ts">
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PlayRetention } from "./PlayRetention.ts";

  const { value, onChange }: {
    value: PlayRetention;
    onChange: (value: PlayRetention) => void;
  } = $props();

  const options: ToggleOption<PlayRetention>[] = [
    {
      value: "oldest",
      text: m.button_text_keep_oldest_play,
      label: m.button_label_keep_oldest_play,
    },
    {
      value: "newest",
      text: m.button_text_keep_newest_play,
      label: m.button_label_keep_newest_play,
    },
  ];
</script>

<div class="trakt-play-retention-toggler">
  <span>{m.label_keep_play()}</span>
  <Toggler {value} {onChange} {options} variant="text" />
</div>

<style>
  .trakt-play-retention-toggler {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-xs);
  }
</style>
