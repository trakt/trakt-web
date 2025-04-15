<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { isImageComplete } from "$lib/utils/image/isImageComplete";
  import type { CardCoverProps } from "./CardCoverProps";

  const {
    src,
    alt,
    badges,
    tags,
    isLoading,
    style = "gradient",
  }: CardCoverProps = $props();

  let isImagePending = $state(!isImageComplete(src));
  $effect(() => {
    if (!isLoading) {
      return;
    }

    isImagePending = true;
  });
</script>

<div class="card-cover" class:card-cover-loading={isImagePending || isLoading}>
  {#if badges}
    <div class="card-cover-badges">
      {@render badges()}
    </div>
  {/if}
  {#if tags}
    <div class="card-cover-tags">
      {@render tags()}
    </div>
  {/if}
  <div class="card-cover-image" class:has-gradient={style === "gradient"}>
    <CrossOriginImage
      animate={false}
      {src}
      {alt}
      onload={() => (isImagePending = false)}
    />
  </div>
</div>

<style>
  .card-cover {
    --padding-card-tag: var(--ni-8);

    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    overflow: hidden;
    position: relative;

    &.card-cover-loading {
      .card-cover-image {
        opacity: 0;
        filter: blur(var(--ni-4));
      }
    }

    .card-cover-badges,
    .card-cover-tags {
      z-index: var(--layer-raised);

      position: absolute;

      display: inline-flex;
      justify-content: flex-end;

      width: 100%;
      padding: var(--padding-card-tag);
      box-sizing: border-box;
    }

    .card-cover-badges {
      top: 0;
      left: 0;
    }

    .card-cover-tags {
      bottom: 0;
      left: 0;

      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-xxs);
    }
  }

  .card-cover-image {
    position: relative;
    height: var(--height-card-cover);
    align-self: stretch;
    transition:
      opacity calc(var(--transition-increment) * 2) ease-in-out,
      filter var(--transition-increment) ease-in-out;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
