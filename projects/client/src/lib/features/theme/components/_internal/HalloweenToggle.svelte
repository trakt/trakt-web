<script lang="ts">
  import HalloweenIcon from "$lib/components/icons/HalloweenIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

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
