<script lang="ts">
  import { autoDismiss } from "$lib/utils/actions/autoDismiss";
  import CloseIcon from "../icons/CloseIcon.svelte";
  import ActionButton from "./ActionButton.svelte";
  import type { TraktActionButtonProps } from "./TraktActionButtonProps";

  type AutoCloseButtonProps = {
    onclick: () => void;
    label: string;
    durationMs?: number;
  } & Pick<TraktActionButtonProps, "style" | "color">;

  const {
    onclick,
    label,
    style = "ghost",
    color,
    durationMs,
  }: AutoCloseButtonProps = $props();
</script>

<div
  class="trakt-auto-close-button"
  use:autoDismiss={{
    onDismiss: onclick,
    durationMs,
  }}
>
  <ActionButton {onclick} {label} {style} {color} size="small">
    <CloseIcon />
  </ActionButton>
</div>

<style>
  .trakt-auto-close-button {
    position: relative;
    flex-shrink: 0;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: var(--ni-36);
      height: var(--ni-36);
      border-radius: 50%;
      background: conic-gradient(
        var(--color-progress-ring, var(--purple-500))
          calc(var(--progress, 0) * 360deg),
        transparent 0deg 360deg
      );
      mask: radial-gradient(
        circle closest-side,
        transparent calc(100% - 2px),
        black calc(100% - 2px)
      );
      pointer-events: none;
      z-index: var(--layer-background);
    }

    :global(.trakt-action-button) {
      border-radius: 50%;
    }
  }
</style>
