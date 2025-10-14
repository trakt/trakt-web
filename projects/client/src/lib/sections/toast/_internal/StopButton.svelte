<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import { useStopNowPlaying } from "./useStopNowPlaying";

  const {
    nowPlaying,
    title,
  }: {
    nowPlaying: NowPlayingItem;
    title: string;
  } = $props();

  const { stop, isStopping, isStoppable } = $derived(
    useStopNowPlaying(nowPlaying),
  );

  const { confirm } = useConfirm();
  const confirmStop = $derived(
    confirm({
      type: ConfirmationType.StopCheckin,
      title,
      onConfirm: stop,
    }),
  );
</script>

{#if isStoppable}
  <ActionButton
    disabled={$isStopping}
    onclick={confirmStop}
    label={m.button_label_stop_playing({ title })}
    style="ghost"
    size="small"
  >
    <CloseIcon />
  </ActionButton>
{/if}
