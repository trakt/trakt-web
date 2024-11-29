<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
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

<ActionButton
  variant="purple"
  label={i18n.label({ title })}
  onclick={onWatch}
  disabled={isMarkingAsWatched || isWatched}
  {...props}
>
  <CheckIcon />
</ActionButton>
