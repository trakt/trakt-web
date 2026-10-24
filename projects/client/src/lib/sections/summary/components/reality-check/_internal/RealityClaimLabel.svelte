<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityClaim } from "$lib/requests/models/RealityCheck.ts";
  import { toTranslatedRealityClaimLabel } from "$lib/utils/formatting/string/toTranslatedRealityClaimLabel.ts";

  const {
    label,
    impact,
  }: { label: RealityClaim["label"]; impact: RealityClaim["impact"] } =
    $props();
</script>

<span class="trakt-reality-claim-label">
  <span class="reality-chip bold" data-label={label} data-impact={impact}>
    {toTranslatedRealityClaimLabel(label)}
  </span>
  {#if impact === "minor"}
    <span class="small secondary">{m.text_reality_claim_minor()}</span>
  {/if}
</span>

<style lang="scss">
  .trakt-reality-claim-label {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    .reality-chip {
      padding: var(--ni-2) var(--ni-10);

      font-size: var(--font-size-tag);
      letter-spacing: 0.02em;
      text-transform: uppercase;

      border-radius: var(--border-radius-xxl);

      &[data-label="accurate"] {
        color: var(--color-reality-accurate-text);
        background: var(--color-reality-accurate-background);
      }

      &[data-label="compressed"],
      &[data-label="composite"] {
        color: var(--color-reality-adjusted-text);
        background: var(--color-reality-adjusted-background);
      }

      &[data-label="changed"],
      &[data-label="invented"] {
        color: var(--color-reality-altered-text);
        background: var(--color-reality-altered-background);
      }

      &[data-impact="minor"] {
        opacity: 0.75;
      }
    }
  }
</style>
