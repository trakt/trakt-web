<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover, state } = useCover();
</script>

{#if $state === "ready"}
  <div class="trakt-cover-image" data-cover-type={$cover.type}>
    <div class="trakt-cover-image-overlay">
      <CrossOriginImage src={$cover.src} alt={`Background for footer`} />
    </div>
  </div>
{/if}

<style>
  .trakt-cover-image {
    --max-image-height: var(--ni-300);

    width: calc(100dvw - 2 * var(--layout-distance-side));
    height: var(--max-image-height);
    overflow: hidden;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .trakt-cover-image-overlay {
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
          var(--cm-background-48) 0%,
          var(--cm-background-50) 13%,
          var(--cm-background-57) 25%,
          var(--cm-background-62) 34%,
          var(--cm-background-70) 46%,
          var(--cm-background-80) 64%,
          var(--cm-background-95) 85%,
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
