<script lang="ts">
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    type,
    onChange,
  }: { type: MediaType; onChange: (value: MediaType) => void } = $props();

  const options: ToggleOption<MediaType>[] = [
    {
      value: "show",
      text: m.button_text_shows,
      label: m.button_label_shows,
    },
    {
      value: "movie",
      text: m.button_text_movies,
      label: m.button_label_movies,
    },
  ];
</script>

<div class="trakt-media-type-toggler">
  <TogglePills value={type} {onChange} {options} />
</div>

<style>
  .trakt-media-type-toggler {
    display: flex;
  }
</style>
