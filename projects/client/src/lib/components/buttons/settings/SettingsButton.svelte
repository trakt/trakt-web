<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LogoutButton from "../logout/LogoutButton.svelte";

  const { style = "flat" }: { style?: "flat" | "ghost" } = $props();
</script>

<RenderForFeature flag={FeatureFlag.Settings}>
  {#snippet enabled()}
    <ActionButton
      {style}
      href={UrlBuilder.settings()}
      label={m.button_label_settings()}
    >
      <GearIcon />
    </ActionButton>
  {/snippet}

  <LogoutButton style="action" />
</RenderForFeature>
