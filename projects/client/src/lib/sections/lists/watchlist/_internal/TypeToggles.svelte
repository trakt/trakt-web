<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { type Writable } from "svelte/store";

  type TypeTogglesProps = {
    types: Writable<MediaType[]>;
  };

  const { types }: TypeTogglesProps = $props();

  const handleTypeChange = (newType: MediaType) => {
    types.update((types) => {
      if (types.includes(newType)) {
        const newTypes = types.filter((type) => type !== newType);
        return newTypes.length > 0 ? newTypes : ["movie", "show"];
      }

      return [...types, newType];
    });
  };
</script>

<div class="watchlist-type-toggles" role="group">
  <ToggleTag
    label={m.button_label_movies()}
    onclick={() => handleTypeChange("movie")}
    isPressed={$types.includes("movie")}
  >
    {m.button_text_movies()}
  </ToggleTag>
  <ToggleTag
    label={m.button_label_shows()}
    onclick={() => handleTypeChange("show")}
    isPressed={$types.includes("show")}
  >
    {m.button_text_shows()}
  </ToggleTag>
</div>

<style>
  .watchlist-type-toggles {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-4);
  }
</style>
