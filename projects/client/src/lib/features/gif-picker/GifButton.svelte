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
  };

  const { onSelect, disabled }: GifButtonProps = $props();

  let isPickerOpen = $state(false);
</script>

<RenderForFeature flag={FeatureFlag.CommentGifs} audience="director">
  {#snippet enabled()}
    <ActionButton
      onclick={() => (isPickerOpen = true)}
      label={m.button_label_add_gif()}
      style="ghost"
      color="purple"
      size="small"
      variant="secondary"
      {disabled}
    >
      <GifIcon />
    </ActionButton>

    {#if isPickerOpen}
      <GifPickerDrawerHost onClose={() => (isPickerOpen = false)} {onSelect} />
    {/if}
  {/snippet}
</RenderForFeature>
