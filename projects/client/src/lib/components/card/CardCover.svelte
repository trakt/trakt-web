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

    border-top-left-radius: var(--border-radius-m);
    border-top-right-radius: var(--border-radius-m);
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

    &.has-gradient::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: var(--width-card);
      height: var(--ni-40);
      flex-shrink: 0;
      z-index: var(--layer-base);

      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-card-background) 7%, transparent 93%) 13%,
        color-mix(in srgb, var(--color-card-background) 18%, transparent 82%)
          24%,
        color-mix(in srgb, var(--color-card-background) 29%, transparent 71%)
          34%,
        color-mix(in srgb, var(--color-card-background) 43%, transparent 57%)
          46%,
        color-mix(in srgb, var(--color-card-background) 62%, transparent 38%)
          63%,
        color-mix(in srgb, var(--color-card-background) 86%, transparent 14%)
          86%,
        var(--color-card-background) 100%
      );
    }
  }
</style>
