<script lang="ts">
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaType } from "$lib/requests/models/MediaType";

  type ToggleType = MediaType | "all";

  type TypeTogglesProps = {
    value: ToggleType;
    onChange: (value: ToggleType) => void;
  };

  const { value, onChange }: TypeTogglesProps = $props();

  const options: ToggleOption<ToggleType>[] = [
    {
      value: "all",
      text: m.button_text_all(),
      label: m.button_label_all(),
    },
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
  ];
</script>

<Toggler {value} {onChange} {options} />
