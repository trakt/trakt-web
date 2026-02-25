<script lang="ts">
  import type { Snippet } from "svelte";
  import FeatureIcon from "./FeatureIcon.svelte";
  import GlassCard from "./GlassCard.svelte";

  const {
    icon,
    description,
    title,
  }: { icon: Snippet; description: string; title: string } = $props();
</script>

<GlassCard variant="plain">
  <div class="trakt-vip-feature">
    <FeatureIcon>{@render icon()}</FeatureIcon>
    <h2 class="trakt-vip-feature-title">{title}</h2>
    <p class="trakt-vip-feature-description">{description}</p>
  </div>
</GlassCard>

<style>
  .trakt-vip-feature {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: var(--ni-38) auto;
    row-gap: var(--gap-xs);
    column-gap: var(--gap-s);
    align-items: start;
  }

  .trakt-vip-feature-title {
    align-self: center;
  }

  .trakt-vip-feature-description {
    grid-column: 2;
  }
</style>
