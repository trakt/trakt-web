<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import BlackFridayContent from "./_internal/BlackFridayContent.svelte";
  import ClaimOfferLink from "./_internal/ClaimOfferLink.svelte";

  import gift from "./assets/black_friday_gift.png";

  const { onDismiss, endDate }: { onDismiss: () => void; endDate: Date } =
    $props();
</script>

<RenderFor audience="all">
  <div class="trakt-black-friday-banner">
    <BlackFridayContent {onDismiss} {endDate} />

    <div class="trakt-black-friday-offer">
      <ClaimOfferLink {endDate} />

      <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
        <DismissButton {onDismiss} />
      </RenderFor>
    </div>

    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src={gift} class="trakt-black-friday-gift" alt="Gift image" />
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-black-friday-banner {
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

  .trakt-black-friday-offer {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      flex-direction: row-reverse;
    }
  }

  .trakt-black-friday-gift {
    z-index: var(--layer-background);

    position: absolute;

    width: var(--ni-172);
    height: auto;

    top: 0;
    left: 50%;

    filter: grayscale(100%);

    transition: var(--transition-increment) ease-in-out;
    transition-property: left, right;

    @include for-tablet-lg {
      left: 60%;
    }

    @include for-tablet-sm-and-below {
      left: auto;
      right: var(--ni-neg-32);
      top: var(--ni-32);
    }
  }
</style>
