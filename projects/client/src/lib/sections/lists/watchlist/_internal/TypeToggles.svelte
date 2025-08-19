<script lang="ts">
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaType } from "$lib/requests/models/MediaType";

  type TypeTogglesProps = {
    value: MediaType[];
    onChange: (value: MediaType[]) => void;
  };

  const { value, onChange }: TypeTogglesProps = $props();

  const options: ToggleOption<MediaType>[] = [
    {
      value: "movie",
      text: m.button_text_movies(),
      label: m.button_label_movies(),
    },
    {
      value: "show",
      text: m.button_text_shows(),
      label: m.button_label_shows(),
    },
  ];
</script>

<Toggler type="combo" {value} {onChange} {options} />
