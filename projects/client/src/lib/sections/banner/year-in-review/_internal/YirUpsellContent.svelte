<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DismissButton from "../../_internal/DismissButton.svelte";

  const { onDismiss, startDate }: { onDismiss: () => void; startDate: Date } =
    $props();

  const year = $derived(startDate.getFullYear());
</script>

<div class="trakt-yir-upsell-content">
  <div class="trakt-yir-upsell-header">
    <span class="trakt-yir-upsell-title title no-wrap">
      <CalendarIcon />
      <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
        Year in Review
      </RenderFor>
      <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
        <div class="title-labels">
          <p class="bold uppercase tag">Year in</p>
          <p class="bold uppercase tag">Review</p>
        </div>
      </RenderFor>
    </span>

    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <DismissButton {onDismiss} />
    </RenderFor>
  </div>

  <div class="yir-tagline">
    <p>Your {year} Year in Review is ready.</p>
    <p>Explore, share, celebrate.</p>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-upsell-content,
  .trakt-yir-upsell-header,
  .trakt-yir-upsell-title {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .trakt-yir-upsell-title {
    gap: var(--gap-xs);
  }

  .trakt-yir-upsell-content {
    gap: var(--gap-l);
  }

  .trakt-yir-upsell-content {
    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;

      gap: var(--gap-m);
    }
  }

  .trakt-yir-upsell-title {
    :global(svg) {
      flex-shrink: 0;

      /* To visually align with the text */
      margin-top: var(--ni-neg-4);
    }

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
    }
  }

  .trakt-yir-upsell-header {
    @include for-tablet-sm-and-below {
      width: 100%;
      justify-content: space-between;
    }
  }

  .title-labels {
    p {
      line-height: var(--font-size-tag);
    }
  }

  .yir-tagline {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    line-height: var(--font-size-text);
  }
</style>
