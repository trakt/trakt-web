<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { CardCoverProps } from "./CardCoverProps";

  const {
    src,
    alt,
    tags,
    isLoading,
    style = "gradient",
  }: CardCoverProps = $props();

  let isImagePending = $state(true);
  $effect(() => {
    if (!isLoading) {
      return;
    }

    isImagePending = true;
  });
</script>

<div class="card-cover" class:card-cover-loading={isImagePending || isLoading}>
  <div class="card-cover-tags">
    {@render tags?.()}
  </div>
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
  .card-cover-tags {
    --padding-card-tag: var(--ni-8);

    width: calc(100% - var(--padding-card-tag) * 2);
    position: absolute;
    padding: var(--padding-card-tag);

    z-index: 2;
    bottom: 0;
    left: 0;

    box-sizing: border-box;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: var(--ni-4);
  }

  .card-cover {
    border-top-left-radius: var(--border-radius-m);
    border-top-right-radius: var(--border-radius-m);
    overflow: hidden;
    position: relative;
  }

  .card-cover-loading {
    .card-cover-image {
      opacity: 0;
      filter: blur(var(--ni-4));
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

    &.has-gradient::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: var(--width-card);
      height: var(--ni-40);
      flex-shrink: 0;
      z-index: 1;

      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-card-background) 2%, transparent 98%) 5%,
        color-mix(in srgb, var(--color-card-background) 4%, transparent 96%) 9%,
        color-mix(in srgb, var(--color-card-background) 7%, transparent 93%) 13%,
        color-mix(in srgb, var(--color-card-background) 10%, transparent 90%)
          17%,
        color-mix(in srgb, var(--color-card-background) 14%, transparent 86%)
          20%,
        color-mix(in srgb, var(--color-card-background) 18%, transparent 82%)
          24%,
        color-mix(in srgb, var(--color-card-background) 23%, transparent 77%)
          29%,
        color-mix(in srgb, var(--color-card-background) 29%, transparent 71%)
          34%,
        color-mix(in srgb, var(--color-card-background) 35%, transparent 65%)
          40%,
        color-mix(in srgb, var(--color-card-background) 43%, transparent 57%)
          46%,
        color-mix(in srgb, var(--color-card-background) 52%, transparent 48%)
          54%,
        color-mix(in srgb, var(--color-card-background) 62%, transparent 38%)
          63%,
        color-mix(in srgb, var(--color-card-background) 73%, transparent 27%)
          74%,
        color-mix(in srgb, var(--color-card-background) 86%, transparent 14%)
          86%,
        var(--color-card-background) 100%
      );
    }
  }
</style>
