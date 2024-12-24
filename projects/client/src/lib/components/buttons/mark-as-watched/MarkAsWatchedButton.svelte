<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import Button from "../Button.svelte";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    isMarkingAsWatched,
    isWatched,
    ...props
  }: MarkAsWatchedButtonProps = $props();
</script>

<Button
  label={i18n.label({ title })}
  color="purple"
  variant="secondary"
  onclick={onWatch}
  disabled={isMarkingAsWatched || isWatched}
  {...props}
>
  {i18n.text({ title })}
  {#snippet icon()}
    <CheckIcon size="small" />
  {/snippet}
</Button>
