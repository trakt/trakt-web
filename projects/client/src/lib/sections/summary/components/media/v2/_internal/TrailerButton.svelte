<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";

  const {
    trailer,
    style = "action",
    slug,
  }: {
    trailer: string;
    slug: string;
    style?: "action" | "dropdown-item";
  } = $props();

  const { track } = useTrack(AnalyticsEvent.Trailer);
  const onclick = () => track({ slug });
</script>

{#if style === "action"}
  <ActionButton
    style="ghost"
    href={trailer}
    label={m.translated_value_video_type_trailer()}
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
    href={trailer}
    {onclick}
  >
    {m.button_text_trailer()}
    {#snippet icon()}
      <YouTubeIcon />
    {/snippet}
  </DropdownItem>
{/if}
