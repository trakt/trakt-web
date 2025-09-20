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
    right: 0;
    bottom: 0;
    left: 0;

    border-radius: var(--border-radius-m);

    opacity: 0.35;
    mask-image: linear-gradient(240deg, #000 0%, #000 15%, transparent 50%);

    :global(img) {
      position: absolute;
      right: 0;

      height: 100%;
      width: 75%;

      object-fit: cover;
    }
  }
</style>
