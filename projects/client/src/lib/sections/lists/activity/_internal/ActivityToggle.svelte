<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { type Writable } from "svelte/store";
  import type { ActivityType } from "../models/ActivityType";

  type ActivityToggleProps = {
    type: Writable<[ActivityType]>;
  };

  const { type }: ActivityToggleProps = $props();

  const options: ToggleOption[] = [
    {
      value: "social",
      label: m.button_text_social(),
    },
    {
      value: "personal",
      label: m.button_text_personal(),
    },
  ];
</script>

<Toggler type="radio" value={type} {options} class="activity-type-toggles" />

<style>
  :global(.activity-type-toggles) {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
