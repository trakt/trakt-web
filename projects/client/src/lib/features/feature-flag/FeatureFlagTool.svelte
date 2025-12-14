<script lang="ts">
  import { TestId } from "$e2e/models/TestId.ts";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { FEATURE_FLAG_LOCAL_STORAGE_KEY } from "./_internal/createFeatureFlagContext.ts";
  import { getFeatureFlagContext } from "./_internal/getFeatureFlagContext.ts";
  import { FeatureFlag } from "./models/FeatureFlag.ts";

  const { flags } = getFeatureFlagContext();

  const setFlag = (flag: FeatureFlag, value: boolean) => {
    const currentFlags = $flags;
    const updatedFlags = { ...currentFlags, [flag]: value };
    safeLocalStorage.setItem(
      FEATURE_FLAG_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedFlags),
    );
    flags.next(updatedFlags);
  };

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const hasFlags = $derived(Object.keys($flags).length > 0);
</script>

<RenderFor audience="director">
  <ActionButton
    label="Feature flags"
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
    data-testid={TestId.FeatureFlagToolButton}
  >
    <CircularLogo />
  </ActionButton>

  {#if $isOpen}
    <Drawer {onClose} title="Feature Flags" hasAutoClose={false}>
      {#if hasFlags}
        {#each Object.entries($flags) as [key, value]}
          <div class="feature-flag-item">
            <span class="bold">{key}</span>
            <Switch
              color="orange"
              label={key}
              checked={value}
              innerText={value ? "on" : "off"}
              onclick={() => setFlag(key as unknown as FeatureFlag, !value)}
            />
          </div>
        {/each}
      {:else}
        <p class="bold">Currently there aren't any feature flags 🎉</p>
      {/if}
    </Drawer>
  {/if}
</RenderFor>

<style>
  .feature-flag-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--gap-m);
  }
</style>
