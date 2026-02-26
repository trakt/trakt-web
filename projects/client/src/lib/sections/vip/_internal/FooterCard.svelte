<script lang="ts">
  import type { Snippet } from "svelte";
  import GlassCard from "./GlassCard.svelte";

  const {
    children,
    icon,
    title,
  }: { icon: Snippet; title: string } & ChildrenProps = $props();
</script>

<GlassCard>
  <div class="trakt-vip-footer-card-content">
    {@render icon()}

    <p class="bold">{title}</p>

    {@render children()}
  </div>
</GlassCard>

<style>
  .trakt-vip-footer-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);
  }
</style>
