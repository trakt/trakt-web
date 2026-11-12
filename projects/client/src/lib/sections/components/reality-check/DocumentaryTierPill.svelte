<script lang="ts">
  import type { DocumentaryTier } from "$lib/requests/models/DocumentaryTier.ts";
  import { toTranslatedDocumentaryTier } from "$lib/utils/formatting/string/toTranslatedDocumentaryTier.ts";

  type DocumentaryTierPillProps = {
    tier: DocumentaryTier;
    size?: "card" | "large";
  };

  const { tier, size = "card" }: DocumentaryTierPillProps = $props();
</script>

<span class="trakt-documentary-tier-pill" data-size={size} data-tier={tier}>
  <span class="pill-dot" aria-hidden="true"></span>
  <span class="bold ellipsis">{toTranslatedDocumentaryTier(tier)}</span>
</span>

<style lang="scss">
  .trakt-documentary-tier-pill {
    --pill-text: var(--color-reality-neutral-text);
    --pill-background: var(--color-reality-neutral-background);

    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--gap-xs);

    box-sizing: border-box;
    max-width: 100%;
    white-space: nowrap;

    color: var(--pill-text);
    background: var(--pill-background);
    border-radius: var(--border-radius-xxl);

    span {
      color: inherit;
    }

    .pill-dot {
      flex-shrink: 0;
      width: var(--ni-8);
      height: var(--ni-8);

      background: currentColor;
      border-radius: 50%;
    }

    &[data-tier="none"] {
      --pill-text: var(--color-reality-accurate-text);
      --pill-background: var(--color-reality-accurate-background);
    }

    &[data-tier="minor"] {
      --pill-text: var(--color-reality-adjusted-text);
      --pill-background: var(--color-reality-adjusted-background);
    }

    &[data-tier="central"] {
      --pill-text: var(--color-reality-central-text);
      --pill-background: var(--color-reality-central-background);
    }

    &[data-tier="wide"] {
      --pill-text: var(--color-reality-altered-text);
      --pill-background: var(--color-reality-altered-background);
    }

    &[data-size="card"] {
      height: var(--ni-24);
      padding: 0 var(--ni-10);

      span.bold {
        font-size: var(--font-size-text-small);
      }
    }

    &[data-size="large"] {
      height: var(--ni-28);
      padding: 0 var(--ni-12);

      span.bold {
        font-size: var(--font-size-text);
      }
    }
  }
</style>
