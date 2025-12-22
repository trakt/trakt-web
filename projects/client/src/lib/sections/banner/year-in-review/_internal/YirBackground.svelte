<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const { year }: { year: number } = $props();
</script>

<RenderFor audience="all" device={["tablet-sm"]}>
  <div class="trakt-year-in-review-background">
    {year}
  </div>
</RenderFor>

<RenderFor audience="all" device={["mobile"]}>
  <div class="trakt-year-in-review-background">
    {`${year}`.slice(-2)}
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-year-in-review-background {
    position: absolute;
    overflow: hidden;
    z-index: var(--layer-background);

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: var(--ni-220);
    font-weight: 600;

    color: transparent;
    opacity: 0.3;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--purple-500) 64%, transparent) -2.25%,
      color-mix(in srgb, var(--purple-500) 32%, transparent) 73.62%,
      color-mix(in srgb, var(--shade-920) 0%, transparent) 105.05%
    );
    background-clip: text;

    @include for-mobile {
      font-size: var(--ni-260);
    }
  }
</style>
