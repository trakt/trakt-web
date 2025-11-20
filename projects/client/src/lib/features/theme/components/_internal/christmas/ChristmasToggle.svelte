<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ChristmasIcon from "../icons/ChristmasIcon.svelte";

  const { isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void } =
    $props();
</script>

<Switch
  label={m.switch_label_toggle_christmas_filters()}
  innerText={isEnabled ? "santa" : "grinch"}
  checked={isEnabled}
  color="red"
  onclick={onToggle}
  --custom-width="var(--ni-80)"
>
  {#snippet icon()}
    <ChristmasIcon />
  {/snippet}
</Switch>
