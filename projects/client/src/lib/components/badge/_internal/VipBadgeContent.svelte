<script lang="ts">
  import BadgeSparkle from "./BadgeSparkle.svelte";

  const { children, size }: { size?: "normal" | "large" } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-badge" data-size={size}>
  <BadgeSparkle />
  <p class="uppercase">
    {@render children()}
  </p>
</div>

<style>
  .trakt-vip-badge {
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
    background: var(--background-vip-badge);
    color: var(--color-foreground-vip-badge);
    box-shadow: var(
      --shadow-decorative-surface,
      inset 0 var(--ni-1) 0
        color-mix(in srgb, var(--purple-100) 45%, transparent),
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--purple-500) 55%, transparent)
    );

    p {
      font-weight: 700;
      white-space: nowrap;
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

    :global(:root[data-reduced-visual-noise]) & {
      border: var(--border-thickness-xxs) solid
        var(--color-flat-surface-border);
      box-shadow: none;
    }
  }
</style>
