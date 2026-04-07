<script lang="ts">
  import { TestId } from "$e2e/models/TestId.ts";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import FeatureFlagItems from "./FeatureFlagItems.svelte";

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);
</script>

<RenderFor audience="vip">
  <ActionButton
    label={m.header_preview_features()}
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
    data-testid={TestId.FeatureFlagToolButton}
  >
    <CircularLogo />
  </ActionButton>

  {#if $isOpen}
    <Drawer {onClose} title={m.header_preview_features()} hasAutoClose={false}>
      <FeatureFlagItems />
    </Drawer>
  {/if}
</RenderFor>
