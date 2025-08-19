<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { type Writable } from "svelte/store";
  import type { ActivityType } from "../models/ActivityType";

  type ActivityToggleProps = {
    type: Writable<ActivityType>;
  };

  const { type }: ActivityToggleProps = $props();
</script>

<div class="watchlist-type-toggles" role="group">
  <ToggleTag
    label={m.button_label_social()}
    onclick={() => type.set("social")}
    isPressed={$type === "social"}
  >
    {m.button_text_social()}
  </ToggleTag>
  <ToggleTag
    label={m.button_label_personal()}
    onclick={() => type.set("personal")}
    isPressed={$type === "personal"}
  >
    {m.button_text_personal()}
  </ToggleTag>
</div>

<style>
  .watchlist-type-toggles {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
