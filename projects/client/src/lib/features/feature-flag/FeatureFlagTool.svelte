<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Sidebar from "$lib/sections/navbar/components/filter/_internal/Sidebar.svelte";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { writable } from "svelte/store";
  import { FEATURE_FLAG_LOCAL_STORAGE_KEY } from "./_internal/createFeatureFlagContext.ts";
  import { getFeatureFlagContext } from "./_internal/getFeatureFlagContext.ts";
  import { FeatureFlag } from "./models/FeatureFlag.ts";

  const { flags } = getFeatureFlagContext();

  const setFlag = (flag: FeatureFlag, value: boolean) => {
    flags.update((currentFlags) => {
      const updatedFlags = { ...currentFlags, [flag]: value };
      safeLocalStorage.setItem(
        FEATURE_FLAG_LOCAL_STORAGE_KEY,
        JSON.stringify(updatedFlags),
      );
      return updatedFlags;
    });
  };

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);
</script>

<RenderFor audience="director">
  <ActionButton
    label="Feature flags"
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
  >
    <CircularLogo variant="flat" />
  </ActionButton>

  {#if $isOpen}
    <Sidebar {onClose} title="Feature Flags" hasAutoClose={false}>
      {#each Object.entries($flags) as [key, value]}
        <div class="feature-flag-item">
          <span class="meta-info">{key}</span>
          <Switch
            color="orange"
            label={key}
            checked={value}
            innerText={value ? "on" : "off"}
            onclick={() => setFlag(key as FeatureFlag, !value)}
          />
        </div>
      {/each}
    </Sidebar>
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
