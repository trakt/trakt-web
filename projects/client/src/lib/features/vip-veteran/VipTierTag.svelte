<script lang="ts">
  import type { TierAuraTier } from "$lib/components/tier-aura/TierAuraTier.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toVipVeteranLabel } from "./toVipVeteranLabel.ts";

  const { tier }: { tier: TierAuraTier } = $props();

  type TagWords = { label: string; title: string | null };

  function toTagWords(tier: TierAuraTier): TagWords {
    switch (tier) {
      case "free":
        return { label: m.text_vip_tier_free(), title: null };
      case "director":
        return { label: "DIRECTOR", title: null };
      case "vip":
        return { label: "VIP", title: null };
      default:
        return { label: "VIP", title: toVipVeteranLabel(tier) };
    }
  }

  const { label, title } = $derived(toTagWords(tier));
</script>

<span class="trakt-vip-tier-tag" data-member-tier={tier}>
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

    padding-inline: var(--ni-10) calc(var(--ni-10) - 0.12em);

    border-radius: var(--border-radius-pill);
    background: var(--tag-fill, var(--tag-surface));
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--tag-ring);

    font-size: var(--font-size-tag);
    white-space: nowrap;

    &[data-member-tier="free"] {
      --tag-ink: var(--shade-400);
      --tag-ring: color-mix(
        in srgb,
        var(--color-text-primary) 14%,
        transparent
      );
    }

    &[data-member-tier="vip"] {
      --tag-ink: var(--color-text-primary);
      --tag-fill: color-mix(in srgb, var(--purple-500) 22%, var(--tag-surface));
      --tag-ring: color-mix(in srgb, var(--purple-500) 70%, transparent);
    }

    &[data-member-tier="pro"] {
      --tag-ink: var(--color-text-primary);
      --tag-title: var(--color-vip-tier-tag-pro-title);
      --tag-fill: color-mix(in srgb, var(--purple-300) 14%, var(--tag-surface));
      --tag-ring: color-mix(in srgb, var(--purple-200) 70%, transparent);
    }

    &[data-member-tier="veteran"],
    &[data-member-tier="elite"],
    &[data-member-tier="legend"] {
      --tag-fill: linear-gradient(
        135deg,
        var(--tag-deep),
        var(--aura-ink) 140%
      );
      --tag-deep: var(--aura-deep);
      --tag-light: var(--aura-light);
      --tag-ring: color-mix(in srgb, var(--tag-light) 55%, transparent);
      --tag-title: var(--tag-light);
    }

    &[data-member-tier="director"] {
      --tag-fill: linear-gradient(
        135deg,
        var(--aura-director-deep),
        var(--aura-ink)
      );
    }
  }

  .trakt-vip-tier-tag .tag-word {
    display: block;
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
