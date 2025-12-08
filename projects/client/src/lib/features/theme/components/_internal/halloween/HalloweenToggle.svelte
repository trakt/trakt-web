<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import HalloweenIcon from "../icons/HalloweenIcon.svelte";

  const { isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void } =
    $props();
</script>

<Switch
  label={m.switch_label_toggle_halloween_filters()}
  innerText={isEnabled ? "boo" : "eek"}
  checked={isEnabled}
  color="orange"
  onclick={onToggle}
>
  {#snippet icon()}
    <HalloweenIcon />
  {/snippet}
</Switch>
