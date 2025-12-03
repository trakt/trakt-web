<script lang="ts">
  import SantaIcon from "$lib/components/icons/SantaIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";

  const { isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void } =
    $props();
</script>

<Switch
  label="TODO"
  innerText={isEnabled ? "santa" : "grinch"}
  checked={isEnabled}
  color="red"
  onclick={onToggle}
  --custom-width="var(--ni-80)"
>
  {#snippet icon()}
    <SantaIcon />
  {/snippet}
</Switch>
