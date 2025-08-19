<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ActivityType } from "../models/ActivityType";

  type ActivityToggleProps = {
    value: ActivityType[];
    onChange: (value: ActivityType[]) => void;
  };

  const { value, onChange }: ActivityToggleProps = $props();

  const options: ToggleOption<ActivityType>[] = [
    {
      value: "social",
      text: m.button_text_social(),
      label: m.button_label_social(),
    },
    {
      value: "personal",
      text: m.button_text_personal(),
      label: m.button_label_personal(),
    },
  ];
</script>

<Toggler type="radio" {value} {onChange} {options} />
