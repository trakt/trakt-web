<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import StopIcon from "$lib/components/icons/StopIcon.svelte";
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
</script>

{#if isStoppable}
  <ActionButton
    disabled={$isStopping}
    onclick={stop}
    label={m.button_label_stop_playing({ title })}
    style="ghost"
    size="small"
  >
    <StopIcon />
  </ActionButton>
{/if}
