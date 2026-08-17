<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const { url }: { url: HttpsUrl } = $props();
</script>

<div class="trakt-confirmation-preview-image">
  <CrossOriginImage classList="preview-image" src={url} alt="" loading="eager" />
</div>

<style lang="scss">
  .trakt-confirmation-preview-image {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: var(--border-radius-m);

    background-color: color-mix(in srgb, var(--color-border) 80%, transparent);
    box-shadow: var(--shadow-base);

    :global(img.preview-image) {
      display: block;

      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
