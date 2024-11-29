<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import { WatchlistButtonIntlProvider } from "./WatchlistButtonIntlProvider";
  import type { WatchlistButtonProps } from "./WatchlistButtonProps";

  const {
    i18n = WatchlistButtonIntlProvider,
    title,
    isWatchlistUpdating,
    isWatchlisted,
    onAdd,
    onRemove,
  }: WatchlistButtonProps = $props();

  const handler = $derived(isWatchlisted ? onRemove : onAdd);
  const state = $derived(isWatchlisted ? "added" : "missing");
</script>

<Button
  label={i18n.label({ isWatchlisted, title })}
  variant="custom"
  onclick={handler}
  disabled={isWatchlistUpdating}
  --color-background-button="var(--blue-200)"
  --color-foreground-button="var(--blue-800)"
>
  {i18n.text({ isWatchlisted, title })}
  {#snippet icon()}
    <WatchlistIcon {state} />
  {/snippet}
</Button>
