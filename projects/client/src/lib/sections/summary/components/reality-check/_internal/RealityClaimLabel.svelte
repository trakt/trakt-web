<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityClaim } from "$lib/requests/models/RealityCheck.ts";
  import { toTranslatedRealityClaimLabel } from "$lib/utils/formatting/string/toTranslatedRealityClaimLabel.ts";
  import RealityChip from "./RealityChip.svelte";
  import type { RealityChipProps } from "./RealityChipProps.ts";

  const LABEL_TONE: Record<RealityClaim["label"], RealityChipProps["tone"]> = {
    accurate: "accurate",
    compressed: "adjusted",
    composite: "adjusted",
    changed: "altered",
    invented: "altered",
  };

  const {
    label,
    impact,
  }: { label: RealityClaim["label"]; impact: RealityClaim["impact"] } =
    $props();
</script>

<span class="trakt-reality-claim-label">
  <RealityChip
    text={toTranslatedRealityClaimLabel(label)}
    tone={LABEL_TONE[label]}
    muted={impact === "minor"}
  />
  {#if impact === "minor"}
    <span class="small secondary">{m.text_reality_claim_minor()}</span>
  {/if}
</span>

<style lang="scss">
  .trakt-reality-claim-label {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
