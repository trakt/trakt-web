<script lang="ts">
  import { useCover } from "$lib/components/background/useCover";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const cover = $derived(useCover());
</script>

<div class="trakt-footer-bg">
  <div class="trakt-footer-bg-overlay">
    <CrossOriginImage src={$cover} alt={`Background for footer`} />
  </div>
</div>

<style>
  .trakt-footer-bg {
    --max-image-height: var(--ni-300);

    width: calc(100dvw - 2 * var(--layout-distance-side));
    height: var(--max-image-height);
    overflow: hidden;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .trakt-footer-bg-overlay {
      display: flex;
      mask-repeat: no-repeat;
      mask-image: url("$lib/sections/footer/components/assets/text_logo.svg");
      mask-size: 100% auto;
      mask-position: top center;
      position: relative;

      &::after {
        content: "";
        width: 100%;
        height: 100%;

        opacity: 0.8;
        position: absolute;
        bottom: 0;
        left: 0;

        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 48%, transparent 52%) 0%,
          color-mix(in srgb, var(--color-background) 49%, transparent 51%) 5%,
          color-mix(in srgb, var(--color-background) 50%, transparent 50%) 9%,
          color-mix(in srgb, var(--color-background) 51%, transparent 49%) 13%,
          color-mix(in srgb, var(--color-background) 53%, transparent 47%) 17%,
          color-mix(in srgb, var(--color-background) 55%, transparent 45%) 20%,
          color-mix(in srgb, var(--color-background) 57%, transparent 43%) 25%,
          color-mix(in srgb, var(--color-background) 59%, transparent 41%) 29%,
          color-mix(in srgb, var(--color-background) 62%, transparent 38%) 34%,
          color-mix(in srgb, var(--color-background) 66%, transparent 34%) 40%,
          color-mix(in srgb, var(--color-background) 70%, transparent 30%) 46%,
          color-mix(in srgb, var(--color-background) 75%, transparent 25%) 55%,
          color-mix(in srgb, var(--color-background) 80%, transparent 20%) 64%,
          color-mix(in srgb, var(--color-background) 85%, transparent 15%) 74%,
          color-mix(in srgb, var(--color-background) 95%, transparent 5%) 85%,
          var(--color-background) 100%
        );

        pointer-events: none;
      }
    }

    :global(img) {
      width: 100%;
      max-height: var(--max-image-height);
      object-fit: cover;
      object-position: top;

      aspect-ratio: 4.4;
    }
  }
</style>
