<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import GifIcon from "$lib/components/icons/GifIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { GifEntry } from "$lib/requests/models/GifEntry.ts";
  import type { GifPickerSource } from "./GifPickerSource.ts";
  import GifPickerDrawerHost from "./GifPickerDrawerHost.svelte";

  type GifButtonProps = {
    onSelect: (gif: GifEntry) => void;
    disabled?: boolean;
    suggestedQuery?: string;
    source: GifPickerSource;
  };

  const { onSelect, disabled, suggestedQuery, source }: GifButtonProps =
    $props();

  const { track } = useTrack(AnalyticsEvent.GifPicker);

  let isPickerOpen = $state(false);

  const openPicker = () => {
    track({ action: "open", source });
    isPickerOpen = true;
  };
</script>

<ActionButton
  onclick={openPicker}
  label={m.button_label_add_gif()}
  type="button"
  style="ghost"
  {disabled}
  --color-foreground="var(--color-text-primary)"
>
  <GifIcon />
</ActionButton>

{#if isPickerOpen}
  <GifPickerDrawerHost
    onClose={() => (isPickerOpen = false)}
    {onSelect}
    {suggestedQuery}
    {source}
  />
{/if}
