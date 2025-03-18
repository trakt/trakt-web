<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover, state } = useCover();
</script>

{#if $state === "ready"}
  <div class="trakt-footer-bg">
    <div class="trakt-footer-bg-overlay">
      <CrossOriginImage src={$cover.src} alt={`Background for footer`} />
    </div>
  </div>
{/if}

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
      mask-image: url("$lib/components/background/assets/text_logo.svg");
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
          color-mix(in srgb, var(--color-background) 51%, transparent 49%) 13%,
          color-mix(in srgb, var(--color-background) 57%, transparent 43%) 25%,
          color-mix(in srgb, var(--color-background) 62%, transparent 38%) 34%,
          color-mix(in srgb, var(--color-background) 70%, transparent 30%) 46%,
          color-mix(in srgb, var(--color-background) 80%, transparent 20%) 64%,
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
