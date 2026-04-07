<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { m } from "$lib/features/i18n/messages";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { FeatureFlag } from "./models/FeatureFlag";
  import { useFeatureFlag } from "./useFeatureFlag";

  const { classList = "" }: { classList?: string } = $props();

  const { flags, setFlag } = useFeatureFlag();

  const hasFlags = $derived(Object.keys($flags).length > 0);

  const getKeyLabel = (key: string) =>
    key
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
</script>

{#if hasFlags}
  {#each Object.entries($flags) as [key, value] (key)}
    <div class="feature-flag-item" use:appendClassList={classList}>
      <span class="bold">{getKeyLabel(key)}</span>
      <Switch
        color="orange"
        label={key}
        checked={value}
        innerText={value ? "On" : "Off"}
        onclick={() => setFlag(key as FeatureFlag, !value)}
      />
    </div>
  {/each}
{:else}
  <p class="bold">{m.text_placeholder_preview_features()}</p>
{/if}

<style>
  .feature-flag-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--gap-m);
  }
</style>
