<script lang="ts">
  import { TestId } from "$e2e/models/TestId.ts";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import FeatureFlagItems from "./FeatureFlagItems.svelte";
  import { useUnreadPreviewFeatures } from "./useUnreadPreviewFeatures.ts";

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const { hasUnreadFeatures, unreadFeatures, markAllRead } =
    useUnreadPreviewFeatures();

  // Snapshot of the unread ids taken when the drawer opens, so the NEW
  // tags stay visible for the session in which the user first sees them.
  let newFeatures = $state<ReadonlyArray<string>>([]);

  const onToggle = () => {
    if (!$isOpen) {
      newFeatures = $unreadFeatures;
      markAllRead();
    }
    isOpen.set(!$isOpen);
  };

  const label = $derived(
    $hasUnreadFeatures
      ? m.button_label_unread_preview_features()
      : m.header_preview_features(),
  );
</script>

<RenderFor audience="vip">
  <div class="trakt-feature-flag-tool">
    <ActionButton
      {label}
      onclick={onToggle}
      style="ghost"
      data-testid={TestId.FeatureFlagToolButton}
    >
      <CircularLogo />
    </ActionButton>

    {#if $hasUnreadFeatures}
      <span class="unread-badge" aria-hidden="true"></span>
    {/if}
  </div>

  {#if $isOpen}
    <Drawer
      {onClose}
      title={m.header_preview_features()}
      hasAutoClose={false}
      size="auto"
    >
      <div class="trakt-feature-flag-items">
        <FeatureFlagItems {newFeatures} />
      </div>
    </Drawer>
  {/if}
</RenderFor>

<style>
  .trakt-feature-flag-tool {
    position: relative;
    display: flex;
  }

  .trakt-feature-flag-tool .unread-badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    background-color: var(--color-background-red);
    pointer-events: none;
  }

  .trakt-feature-flag-items {
    overflow-y: auto;
  }
</style>
