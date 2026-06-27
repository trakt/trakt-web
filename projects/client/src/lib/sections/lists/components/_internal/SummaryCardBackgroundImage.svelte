<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const { src, alt }: { src: string; alt: string } = $props();
</script>

<div class="trakt-summary-card-background">
  <CrossOriginImage loading="eager" {src} {alt} />
</div>

<style>
  .trakt-summary-card-background {
    position: absolute;
    overflow: hidden;

    top: 0;
    inset-inline-end: 0;
    bottom: 0;
    inset-inline-start: 0;

    border-radius: var(--border-radius-m);

    opacity: 0.35;

    --mask-angle: 240deg;

    &:dir(rtl) {
      --mask-angle: 120deg;
    }

    mask-image: linear-gradient(var(--mask-angle), #000 0%, #000 15%, transparent 50%);

    :global(img) {
      position: absolute;
      inset-inline-end: 0;

      height: 100%;
      width: 75%;

      object-fit: cover;
    }
  }
</style>
