<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DismissButton from "../../_internal/DismissButton.svelte";
  import DealEnd from "./DealEnd.svelte";
  import GiftIcon from "./GiftIcon.svelte";

  const { onDismiss, endDate }: { onDismiss: () => void; endDate: Date } =
    $props();
</script>

<div class="trakt-black-friday-content">
  <div class="trakt-black-friday-header">
    <span class="trakt-black-friday-title title no-wrap">
      <GiftIcon />Black Friday Deal!
    </span>

    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <DismissButton {onDismiss} />
    </RenderFor>
  </div>
  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <DealEnd {endDate} />
  </RenderFor>
  <p>Trakt VIP for less than a can of Pringles!</p>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-black-friday-content,
  .trakt-black-friday-header,
  .trakt-black-friday-title {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .trakt-black-friday-content {
    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;

      gap: var(--gap-xs);
    }
  }

  .trakt-black-friday-title {
    :global(svg) {
      flex-shrink: 0;

      /* To visually align with the text */
      margin-top: var(--ni-neg-4);
    }

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
    }
  }

  .trakt-black-friday-header {
    @include for-tablet-sm-and-below {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
