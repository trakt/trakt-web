<script lang="ts">
  import type { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

<RenderFor {audience}>
  {#if $isFlagEnabled}
    {@render enabled()}
  {:else}
    {@render children?.()}
  {/if}
</RenderFor>
