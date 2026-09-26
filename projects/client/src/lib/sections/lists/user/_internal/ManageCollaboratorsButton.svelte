<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";

  const {
    list,
    isDeleting,
    onClick,
  }: { list: MediaListSummary; isDeleting: boolean; onClick: () => void } =
    $props();
</script>

<RenderForFeature flag={FeatureFlag.ListCollaborators}>
  {#snippet enabled()}
    <DropdownItem
      label={m.button_label_manage_collaborators({ name: list.name })}
      style="flat"
      color="default"
      variant="secondary"
      disabled={isDeleting}
      onclick={onClick}
    >
      {m.button_text_manage_collaborators()}

      {#snippet icon()}
        <SocialIcon />
      {/snippet}
    </DropdownItem>
  {/snippet}
</RenderForFeature>
