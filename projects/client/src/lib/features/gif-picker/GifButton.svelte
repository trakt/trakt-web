<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import GifIcon from "$lib/components/icons/GifIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { GifEntry } from "$lib/requests/models/GifEntry.ts";
  import GifPickerDrawerHost from "./GifPickerDrawerHost.svelte";

  type GifButtonProps = {
    onSelect: (gif: GifEntry) => void;
    disabled?: boolean;
    suggestedQuery?: string;
  };

  const { onSelect, disabled, suggestedQuery }: GifButtonProps = $props();

  let isPickerOpen = $state(false);
</script>

<RenderForFeature flag={FeatureFlag.CommentGifs}>
  {#snippet enabled()}
    <ActionButton
      onclick={() => (isPickerOpen = true)}
      label={m.button_label_add_gif()}
      type="button"
      style="ghost"
      size="small"
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
      />
    {/if}
  {/snippet}
</RenderForFeature>
