<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
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
  <Button
    disabled={$isStopping}
    onclick={stop}
    label={m.button_label_stop_playing({ title })}
    style="ghost"
    size="small"
  >
    {m.button_text_stop_playing()}
    {#snippet icon()}
      <StopIcon />
    {/snippet}
  </Button>
{/if}
