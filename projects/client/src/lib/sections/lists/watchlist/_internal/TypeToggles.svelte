<script lang="ts">
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaType } from "$lib/requests/models/MediaType";
  import { type Writable } from "svelte/store";

  type TypeTogglesProps = {
    types: Writable<MediaType[]>;
  };

  const { types }: TypeTogglesProps = $props();

  const options: ToggleOption[] = [
    {
      value: "movie",
      label: m.button_text_movies(),
    },
    {
      value: "show",
      label: m.button_text_shows(),
    },
  ];
</script>

<Toggler type="combo" value={types} {options} class="watchlist-type-toggles" />

<style>
  :global(.watchlist-type-toggles) {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
