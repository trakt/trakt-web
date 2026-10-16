<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import MusicNoteIcon from "$lib/components/icons/MusicNoteIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { MixtapeEntryButtonProps } from "./MixtapeEntryButtonProps.ts";

  const { type, source, pick }: MixtapeEntryButtonProps = $props();

  const text = $derived(
    pick == null ? m.button_text_make_mixtape() : m.button_text_add_to_mixtape(),
  );
</script>

<RenderForFeature flag={FeatureFlag.Mixtape} audience="director">
  {#snippet enabled()}
    <Button
      href={UrlBuilder.mixtape({
        type,
        picks: pick == null ? undefined : [pick],
        source,
      })}
      size="small"
      style="ghost"
      variant="secondary"
      label={text}
    >
      {text}
      {#snippet icon()}
        <MusicNoteIcon />
      {/snippet}
    </Button>
  {/snippet}
</RenderForFeature>
