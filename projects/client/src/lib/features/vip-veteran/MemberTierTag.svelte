<script lang="ts">
  import type { MemberTier } from "./MemberTier.ts";
  import { toMemberTierLabel } from "./toMemberTierLabel.ts";

  const { tier }: { tier: MemberTier } = $props();
</script>

<!-- A member's tier in the colour of their ring. -->
<span class="trakt-member-tier-tag" data-tier={tier}>
  <span class="tag-label">{toMemberTierLabel(tier)}</span>
</span>

<style lang="scss">
  .trakt-member-tier-tag {
    --tag-tier: var(--member-tier-vip);
    --tag-sheen: var(--member-tier-vip-sheen);
    --tag-fill: linear-gradient(
      115deg,
      var(--tag-tier) 0%,
      color-mix(in srgb, var(--tag-sheen) 55%, var(--tag-tier)) 55%,
      var(--tag-tier) 100%
    );
    --tag-ink: var(--shade-10);

    display: inline-flex;
    align-items: center;
    justify-content: center;

    block-size: var(--ni-28);
    padding-inline: var(--ni-14) calc(var(--ni-14) - 0.14em);
    box-sizing: border-box;

    border-radius: var(--border-radius-pill);
    background: var(--tag-fill);
    box-shadow: var(--tag-shadow, none);
    white-space: nowrap;

    &[data-tier="free"] {
      --tag-fill: transparent;
      --tag-ink: var(--color-text-secondary);
      --tag-shadow: inset 0 0 0 1px var(--color-member-tier-free-ring);
    }

    &[data-tier="pro"] {
      --tag-tier: var(--member-tier-pro);
      --tag-sheen: var(--member-tier-pro-sheen);
    }

    &[data-tier="veteran"] {
      --tag-tier: var(--member-tier-veteran);
      --tag-sheen: var(--member-tier-veteran-sheen);
    }

    &[data-tier="elite"] {
      --tag-tier: var(--member-tier-elite);
      --tag-sheen: var(--member-tier-elite-sheen);
    }

    &[data-tier="legend"] {
      --tag-fill: var(--member-tier-legend-ring);
      --tag-ink: var(--member-tier-legend-ink);
    }

    &[data-tier="original"] {
      --tag-fill: var(--member-tier-original-tag);
      --tag-ink: var(--member-tier-original-rose-light);
      --tag-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--member-tier-original-rose) 55%, transparent);
    }

    &[data-tier="director"] {
      --tag-fill: var(--background-member-tier-director-tag);
      --tag-ink: var(--color-member-tier-director-tag);
    }
  }

  /* Anchored under the root to outrank .trakt-link's span colour. */
  .trakt-member-tier-tag .tag-label {
    font-size: var(--font-size-text-small);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--tag-ink);
  }
</style>
