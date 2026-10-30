<script lang="ts">
  import type { UserTier } from "./UserTier.ts";
  import { toUserTierTitle } from "./toUserTierTitle.ts";

  const {
    tier,
    isDirector = false,
  }: { tier: UserTier; isDirector?: boolean } = $props();

  const label = $derived(isDirector ? "Director" : toUserTierTitle(tier));
</script>

<span class="trakt-user-tier-tag" data-user-tier={tier}>
  <span class="tag-label">{label}</span>
</span>

<style lang="scss">
  .trakt-user-tier-tag {
    --tag-tier: var(--user-tier-color);
    --tag-sheen: var(--user-tier-sheen);
    --tag-fill: linear-gradient(
      135deg,
      var(--tag-sheen),
      color-mix(in srgb, var(--tag-tier) 82%, var(--shade-900))
    );
    --tag-shadow:
      inset 0 var(--ni-1) 0
        color-mix(
          in srgb,
          color-mix(in srgb, var(--tag-sheen) 35%, var(--shade-10)) 45%,
          transparent
        ),
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--tag-tier) 55%, transparent);
    --tag-ink: var(--shade-10);

    display: inline-flex;
    align-items: center;
    justify-content: center;

    block-size: var(--ni-28);
    padding-inline: var(--ni-14) calc(var(--ni-14) - 0.14em);
    box-sizing: border-box;

    border-radius: var(--border-radius-pill);
    background: var(--tag-fill);
    box-shadow: var(--tag-shadow);
    white-space: nowrap;

    &[data-user-tier="free"] {
      --tag-fill: transparent;
      --tag-ink: var(--color-text-secondary);
      --tag-shadow: inset 0 0 0 1px var(--color-user-tier-free-ring);
    }

    &[data-user-tier="legend"] {
      --tag-fill: var(--user-tier-legend-tag);
      --tag-ink: var(--user-tier-legend-ink);
      --tag-shadow: var(--user-tier-legend-tag-shadow);
      --tag-ink-shadow: var(--user-tier-legend-tag-engrave);
    }
  }

  .trakt-user-tier-tag .tag-label {
    font-size: var(--font-size-text-small);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--tag-ink);
    text-shadow: var(--tag-ink-shadow, none);
  }
</style>
