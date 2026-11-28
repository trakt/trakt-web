<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import type { DunesdaySide } from "./DunesdaySide.ts";
  import { dunesdayState } from "./dunesdayState.svelte.ts";
  import SideIcon from "./SideIcon.svelte";

  const OPTIONS: ReadonlyArray<{ side: DunesdaySide; label: () => string }> = [
    { side: "dune", label: () => m.text_topic_dunesday_team_dune() },
    { side: "double", label: () => m.text_topic_dunesday_double_feature() },
    { side: "doom", label: () => m.text_topic_dunesday_team_doom() },
  ];
</script>

<div
  class="dd-picker"
  role="group"
  aria-label={m.text_topic_dunesday_picker_label()}
>
  {#each OPTIONS as option (option.side)}
    <button
      type="button"
      class="dd-picker-option"
      data-side={option.side}
      aria-pressed={dunesdayState.side === option.side}
      onclick={() => (dunesdayState.side = option.side)}
    >
      <SideIcon side={option.side} />
      <span>{option.label()}</span>
    </button>
  {/each}
</div>
