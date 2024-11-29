<script lang="ts">
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { WatchlistButtonIntlProvider } from "./WatchlistButtonIntlProvider";
  import type { WatchlistButtonProps } from "./WatchlistButtonProps";

  const {
    i18n = WatchlistButtonIntlProvider,
    title,
    onAdd,
    onRemove,
    isWatchlisted,
    isAddingToWatchlist,
    ...props
  }: WatchlistButtonProps = $props();

  const state = $derived(isWatchlisted ? "added" : "missing");
  const variant = $derived(isWatchlisted ? "default" : "blue");
  const handler = $derived(isWatchlisted ? onRemove : onAdd);
</script>

<ActionButton
  disabled={isAddingToWatchlist}
  onclick={handler}
  label={i18n.label({ isWatchlisted, title })}
  {variant}
  {...props}
>
  <WatchlistIcon {state} />
</ActionButton>
