<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import { MOCK_REALITY_CLAIMS } from "./constants/MOCK_REALITY_CLAIMS.ts";
  import RealityCheckClaims from "./RealityCheckClaims.svelte";
</script>

<div class="trakt-reality-check-upsell">
  <UpsellCta source="reality-check">
    {m.text_vip_upsell_sentiment()}
  </UpsellCta>

  <div class="reality-preview" aria-hidden="true" inert>
    <InfoCard>
      <p class="bold">{m.header_reality_claims()}</p>
      <RealityCheckClaims claims={MOCK_REALITY_CLAIMS} />
    </InfoCard>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reality-check-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .reality-preview {
      @include spoiler-blur();

      pointer-events: none;
      user-select: none;
    }
  }
</style>
