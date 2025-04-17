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
    title,
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

<div
  class="trakt-card-cover"
  class:trakt-card-cover-loading={isImagePending || isLoading}
>
  {#if badges}
    <div class="trakt-card-cover-badges">
      {@render badges()}
    </div>
  {/if}
  {#if tags}
    <div class="trakt-card-cover-tags">
      {@render tags()}
    </div>
  {/if}
  <div class="trakt-card-cover-image" class:has-gradient={style === "gradient"}>
    <span class="trakt-cover-image-title meta-info">{title}</span>
    <CrossOriginImage
      animate={false}
      {src}
      {alt}
      onload={() => (isImagePending = false)}
    />
  </div>
</div>

<style>
  .trakt-card-cover {
    --padding-card-tag: var(--ni-8);

    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    overflow: hidden;
    position: relative;

    &.trakt-card-cover-loading {
      .trakt-card-cover-image {
        opacity: 0;
        filter: blur(var(--ni-4));
      }
    }

    .trakt-card-cover-badges,
    .trakt-card-cover-tags {
      z-index: var(--layer-raised);

      position: absolute;

      display: inline-flex;
      justify-content: flex-end;

      width: 100%;
      padding: var(--padding-card-tag);
      box-sizing: border-box;
    }

    .trakt-card-cover-badges {
      top: 0;
      left: 0;
    }

    .trakt-card-cover-tags {
      bottom: 0;
      left: 0;

      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-xxs);
    }
  }

  .trakt-card-cover-image {
    position: relative;
    height: var(--height-card-cover);
    align-self: stretch;
    transition:
      opacity calc(var(--transition-increment) * 2) ease-in-out,
      filter var(--transition-increment) ease-in-out;

    .trakt-cover-image-title {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: var(--ni-8);

      text-align: center;
    }

    :global(img) {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
