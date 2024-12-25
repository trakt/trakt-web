<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { writable } from "svelte/store";
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import Button from "../Button.svelte";
  import { attachRemoveWarning } from "./attachRemoveWarning";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    onRemove,
    isMarkingAsWatched,
    isWatched,
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const handler = $derived(
    isWatched
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatched, title }))
      : onWatch,
  );

  const stateToColor = (isWatched: boolean) => (isWatched ? "red" : "purple");
  /**
   * TODO: extact this logic as danger mode for buttons in general
   * we need to have something like mode="action" | "danger"
   */
  const isTouch = useMedia(WellKnownMediaQuery.touch);
  const seedColor = $derived($isTouch ? stateToColor(isWatched) : "purple");
  const color = $derived(writable<"purple" | "red">(seedColor));
  const variant = $derived(isWatched ? "secondary" : "primary");
</script>

<Button
  label={i18n.label({ title, isWatched })}
  color={$color}
  variant="secondary"
  onclick={handler}
  disabled={isMarkingAsWatched}
  onmouseover={() => color.set(stateToColor(isWatched))}
  onfocusin={() => color.set(stateToColor(isWatched))}
  onfocusout={() => color.set(seedColor)}
  onmouseout={() => color.set(seedColor)}
  {...props}
>
  {i18n.text({ title, isWatched })}
  {#snippet icon()}
    <MarkAsWatchedIcon
      state={isWatched ? "watched" : "unwatched"}
      size="small"
    />
  {/snippet}
</Button>
