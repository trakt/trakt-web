<script lang="ts">
  import type { Snippet } from "svelte";
  import GlassCard from "./GlassCard.svelte";

  const {
    children,
    icon,
    title,
  }: { icon: Snippet; title?: string } & ChildrenProps = $props();
</script>

<GlassCard variant="bordered">
  <div class="trakt-vip-footer-card-content">
    {@render icon()}

    {#if title}
      <h3>{title}</h3>
    {/if}

    {@render children()}
  </div>
</GlassCard>

<style>
  .trakt-vip-footer-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);

    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    line-height: var(--ni-20);

    h3 {
      font-size: var(--ni-20);
      margin: 0;
      color: var(--color-text-primary);
    }
  }
</style>
