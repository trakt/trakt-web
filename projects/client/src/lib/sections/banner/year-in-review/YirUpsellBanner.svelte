<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import YirBackground from "./_internal/YirBackground.svelte";
  import YirUpgradeLink from "./_internal/YirUpgradeLink.svelte";
  import YirUpsellContent from "./_internal/YirUpsellContent.svelte";

  const {
    onDismiss,
    promotion,
  }: { onDismiss: () => void; promotion: Promotion } = $props();
</script>

<div class="trakt-yir-upsell-banner">
  <YirBackground year={promotion.start.getFullYear()} />
  <YirUpsellContent {onDismiss} startDate={promotion.start} />

  <div class="trakt-yir-offer">
    <YirUpgradeLink {promotion} startDate={promotion.start} />

    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <DismissButton {onDismiss} />
    </RenderFor>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-upsell-banner {
    position: relative;
    overflow: hidden;

    z-index: var(--layer-base);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    color: var(--shade-10);

    height: var(--ni-56);

    padding: 0 var(--ni-18);
    box-sizing: border-box;

    background: linear-gradient(
      178deg,
      var(--shade-920) 43.39%,
      color-mix(in srgb, var(--purple-500) 75%, transparent) 145.02%
    );

    border-radius: var(--border-radius-l);

    transition: var(--transition-increment) ease-in-out;
    transition-property: height, padding, gap;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;

      height: var(--ni-156);
      padding: var(--ni-16);
      gap: var(--gap-xs);

      background: linear-gradient(
        135.65deg,
        var(--shade-920) 43.39%,
        color-mix(in srgb, var(--purple-500) 75%, transparent) 145.02%
      );
    }
  }

  .trakt-yir-offer {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      flex-direction: row-reverse;
    }
  }
</style>
