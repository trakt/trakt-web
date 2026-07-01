<script lang="ts">
  import type { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import RenderForAudience from "$lib/guards/_internal/RenderForAudience.svelte";
  import type { Snippet } from "svelte";

  const {
    flag,
    enabled,
    children,
    audience = "vip",
  }: {
    flag: FeatureFlag;
    enabled: Snippet;
    audience?: "director" | "vip";
  } & Partial<ChildrenProps> = $props();

  const { isEnabled } = useFeatureFlag();
  const isFlagEnabled = $derived(isEnabled(flag));
</script>

{#if $isFlagEnabled}
  <RenderForAudience {audience}>
    {@render enabled()}
    {#snippet fallback()}
      {@render children?.()}
    {/snippet}
  </RenderForAudience>
{:else}
  {@render children?.()}
{/if}
