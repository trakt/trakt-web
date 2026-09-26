<script lang="ts">
  import NoveltySwitch from "$lib/components/toggles/NoveltySwitch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import HalloweenIcon from "../icons/HalloweenIcon.svelte";

  const { isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void } =
    $props();
</script>

<NoveltySwitch
  label={m.switch_label_toggle_halloween_filters()}
  innerText={isEnabled ? "boo" : "eek"}
  checked={isEnabled}
  color="orange"
  onclick={onToggle}
>
  {#snippet icon()}
    <HalloweenIcon />
  {/snippet}
</NoveltySwitch>
