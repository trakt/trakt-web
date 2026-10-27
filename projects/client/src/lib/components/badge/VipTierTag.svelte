<script lang="ts">
  import type { VipTierTagProps } from "./_internal/VipTierTagProps.ts";

  const { tier, label, title = null }: VipTierTagProps = $props();
</script>

<!--
  "VIP · TITLE" under a profile avatar; the title takes the tier's colour.
  It overlaps the avatar's aura, so every fill is opaque: tints are mixed into
  --tier-aura-surface (what the avatar sits on) instead of letting it through.
-->
<span class="trakt-vip-tier-tag" data-tier={tier}>
  <span class="tag-word">{label}</span>
  {#if title}
    <span class="tag-word tag-title">{title}</span>
  {/if}
</span>

<style lang="scss">
  .trakt-vip-tier-tag {
    --tag-surface: var(--tier-aura-surface, var(--color-background));
    --tag-ink: var(--aura-white);
    --tag-title: var(--aura-white);
    --tag-ring: color-mix(in srgb, var(--aura-white) 80%, transparent);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-6);

    block-size: var(--ni-24);
    box-sizing: border-box;

    /* The tracking trails the last letter; trim it from the end. */
    padding-inline: var(--ni-10) calc(var(--ni-10) - 0.12em);

    border-radius: var(--border-radius-pill);
    background: var(--tag-fill, var(--tag-surface));
    box-shadow: inset 0 0 0 1px var(--tag-ring);

    font-size: var(--font-size-tier-tag);
    white-space: nowrap;

    &[data-tier="free"] {
      --tag-ink: var(--shade-400);
      --tag-ring: color-mix(
        in srgb,
        var(--color-text-primary) 14%,
        transparent
      );
    }

    &[data-tier="vip"] {
      --tag-ink: var(--color-text-primary);
      --tag-fill: color-mix(in srgb, var(--purple-500) 22%, var(--tag-surface));
      --tag-ring: color-mix(in srgb, var(--purple-500) 70%, transparent);
    }

    &[data-tier="pro"] {
      --tag-ink: var(--color-text-primary);
      --tag-title: var(--color-vip-tier-tag-pro-title);
      --tag-fill: color-mix(in srgb, var(--purple-300) 14%, var(--tag-surface));
      --tag-ring: color-mix(in srgb, var(--purple-200) 70%, transparent);
    }

    &[data-tier="veteran"],
    &[data-tier="elite"],
    &[data-tier="legend"] {
      --tag-fill: linear-gradient(
        135deg,
        var(--tag-deep),
        var(--aura-ink) 140%
      );
      --tag-ring: color-mix(in srgb, var(--tag-light) 55%, transparent);
      --tag-title: var(--tag-light);
    }

    &[data-tier="veteran"] {
      --tag-deep: var(--aura-veteran-deep);
      --tag-light: var(--aura-veteran-light);
    }

    &[data-tier="elite"] {
      --tag-deep: var(--aura-elite-deep);
      --tag-light: var(--aura-elite-light);
    }

    &[data-tier="legend"] {
      --tag-deep: var(--aura-legend-deep);
      --tag-light: var(--aura-legend-light);
    }

    &[data-tier="director"] {
      --tag-fill: linear-gradient(
        135deg,
        var(--aura-director-deep),
        var(--aura-ink)
      );
    }
  }

  /* Anchored under the root to outrank .trakt-link's span colour. */
  .trakt-vip-tier-tag .tag-word {
    display: block;
    font-size: var(--font-size-tier-tag);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--tag-ink);
    text-box: trim-both cap alphabetic;
  }

  .trakt-vip-tier-tag .tag-title {
    color: var(--tag-title);
  }
</style>
