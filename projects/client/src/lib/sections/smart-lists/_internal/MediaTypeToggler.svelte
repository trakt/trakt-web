<script lang="ts">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    type,
    onChange,
  }: { type: DiscoverMode; onChange: (value: DiscoverMode) => void } = $props();

  const options: SegmentedSelectOption<DiscoverMode>[] = [
    {
      value: "show",
      text: m.button_text_shows(),
      label: m.button_label_shows(),
    },
    {
      value: "movie",
      text: m.button_text_movies(),
      label: m.button_label_movies(),
    },
    {
      value: "media",
      text: m.button_text_media(),
      label: m.button_label_media(),
    },
  ];
</script>

<div class="trakt-media-type-toggler">
  <SegmentedSelect variant="compact" value={type} {options} {onChange}>
    {#snippet icon(option: SegmentedSelectOption<DiscoverMode>)}
      <ToggleIcon {option} />
    {/snippet}
  </SegmentedSelect>
</div>

<style>
  .trakt-media-type-toggler {
    display: flex;
  }
</style>
