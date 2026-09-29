<script lang="ts">
  import type { VipBadgeTone } from "../VipBadgeTone.ts";
  import BadgeSparkle from "./BadgeSparkle.svelte";

  const {
    children,
    size,
    tone,
  }: { size?: "normal" | "large"; tone?: VipBadgeTone } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-badge" data-size={size} data-tone={tone}>
  <BadgeSparkle />
  <p class="uppercase">
    {@render children()}
  </p>
</div>

<style>
  .trakt-vip-badge {
    --vip-badge-start: var(--color-background-vip-badge-vip-start);
    --vip-badge-end: var(--color-background-vip-badge-vip-end);
    --vip-badge-glow: var(--color-glow-vip-badge-vip);
    --vip-badge-highlight: var(--purple-100);

    display: flex;
    padding: var(--ni-8) var(--ni-12);
    align-items: center;
    gap: var(--gap-xs);

    height: var(--ni-28);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    /* Same design language as VipUpsellBadge: purple gradient + soft glow,
       replacing the legacy flat red pill. The gradient range is wider and a
       glossy top edge is added because the pill is small and often sits on a
       purple VIP card, where the upsell recipe reads flat. */
    background: linear-gradient(
      135deg,
      var(--vip-badge-start),
      var(--vip-badge-end)
    );
    color: var(--color-foreground-vip-badge);
    box-shadow:
      inset 0 var(--ni-1) 0
        color-mix(in srgb, var(--vip-badge-highlight) 45%, transparent),
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--vip-badge-glow) 55%, transparent);

    p {
      font-weight: 700;
      white-space: nowrap;
    }

    &[data-tone="deep"] {
      --vip-badge-start: var(--color-background-vip-badge-deep-start);
      --vip-badge-end: var(--color-background-vip-badge-deep-end);
      --vip-badge-glow: var(--color-glow-vip-badge-deep);
      color: var(--color-foreground-vip-badge-deep);
    }

    &[data-tone="copper"] {
      --vip-badge-start: var(--color-background-vip-badge-copper-start);
      --vip-badge-end: var(--color-background-vip-badge-copper-end);
      --vip-badge-glow: var(--color-glow-vip-badge-copper);
      --vip-badge-highlight: var(--orange-100);
      color: var(--color-foreground-vip-badge-copper);
    }

    &[data-tone="silver"] {
      --vip-badge-start: var(--color-background-vip-badge-silver-start);
      --vip-badge-end: var(--color-background-vip-badge-silver-end);
      --vip-badge-glow: var(--color-glow-vip-badge-silver);
      --vip-badge-highlight: var(--shade-10);
      color: var(--color-foreground-vip-badge-silver);
    }

    &[data-tone="gold"] {
      --vip-badge-start: var(--color-background-vip-badge-gold-start);
      --vip-badge-end: var(--color-background-vip-badge-gold-end);
      --vip-badge-glow: var(--color-glow-vip-badge-gold);
      --vip-badge-highlight: var(--yellow-50);
      color: var(--color-foreground-vip-badge-gold);
    }

    &[data-size="large"] {
      padding: var(--ni-12) var(--ni-16);
      height: var(--ni-40);

      p {
        font-size: var(--font-size-title);
      }

      :global(.trakt-badge-sparkle) {
        --badge-sparkle-size: var(--ni-20);
      }
    }
  }
</style>
