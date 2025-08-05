<script lang="ts">
  import type { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { Snippet } from "svelte";

  const {
    flag,
    enabled,
    children,
  }: { flag: FeatureFlag; enabled: Snippet } & Partial<ChildrenProps> =
    $props();

  const { isEnabled } = $derived(useFeatureFlag(flag));
</script>

{#if $isEnabled}
  {@render enabled()}
{:else}
  {@render children?.()}
{/if}
