<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { usePlayer } from "$lib/features/player/stores/usePlayer";

  const {
    trailer,
    style = "action",
    slug,
  }: {
    trailer: string;
    slug: string;
    style?: "action" | "dropdown-item";
  } = $props();

  const { play, preload, isLoading } = usePlayer();

  const { track } = useTrack(AnalyticsEvent.Trailer);
  const onclick = () => {
    play(trailer);
    track({ slug });
  };

  preload(trailer);
</script>

{#if style === "action"}
  <ActionButton
    style="ghost"
    href="javascript:void(0);"
    label={m.translated_value_video_type_trailer()}
    disabled={$isLoading}
    {onclick}
  >
    <YouTubeIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    color="default"
    variant="secondary"
    style="flat"
    href="javascript:void(0);"
    {onclick}
    disabled={$isLoading}
  >
    {m.button_text_trailer()}
    {#snippet icon()}
      <YouTubeIcon />
    {/snippet}
  </DropdownItem>
{/if}
