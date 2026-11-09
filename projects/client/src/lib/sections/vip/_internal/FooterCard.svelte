<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
  import type { Snippet } from "svelte";
  import GlassCard from "./GlassCard.svelte";

  const {
    children,
    icon,
    title,
    isHero = false,
  }: {
    icon: Snippet;
    title?: string;
    isHero?: boolean;
  } & ChildrenProps = $props();
</script>

<GlassCard variant="soft">
  {#if isHero}
    <ThreadRing opacity={0.9} />
  {/if}

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
    position: relative;

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
