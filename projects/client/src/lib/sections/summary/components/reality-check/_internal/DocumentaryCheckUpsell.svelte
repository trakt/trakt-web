<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { MOCK_DOCUMENTARY_DISPUTES } from "./constants/MOCK_DOCUMENTARY_DISPUTES.ts";
  import DocumentaryDisputes from "./DocumentaryDisputes.svelte";
</script>

<div class="trakt-documentary-check-upsell">
  <UpsellCta source="reality-check">
    {m.text_vip_upsell_sentiment()}
  </UpsellCta>

  <div class="documentary-preview" aria-hidden="true" inert>
    <DocumentaryDisputes disputes={MOCK_DOCUMENTARY_DISPUTES} />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-documentary-check-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .documentary-preview {
      @include spoiler-blur();

      pointer-events: none;
      user-select: none;
    }
  }
</style>
