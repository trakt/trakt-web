<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { isImageComplete } from "$lib/utils/image/isImageComplete";
  import { checksum } from "$lib/utils/string/checksum";
  import type { CardCoverProps } from "./CardCoverProps";

  const {
    src,
    alt,
    badge,
    tag,
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

  const id = $derived(checksum(`${src}-${title}`));
</script>

<div
  class="trakt-card-cover"
  class:trakt-card-cover-loading={isImagePending || isLoading}
  class:trakt-card-cover-placeholder={PLACEHOLDERS.includes(src)}
>
  {#if badge}
    <div class="trakt-card-cover-badge">
      {@render badge()}
    </div>
  {/if}
  {#if tag}
    <div class="trakt-card-cover-tag">
      {@render tag()}
    </div>
  {/if}
  <div class="trakt-card-cover-image" class:has-gradient={style === "gradient"}>
    <span {id} class="trakt-cover-image-title meta-info">{title}</span>
    <CrossOriginImage
      animate={false}
      {src}
      {alt}
      onload={() => (isImagePending = false)}
      aria-labelledby={id}
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

    .trakt-card-cover-badge,
    .trakt-card-cover-tag {
      z-index: var(--layer-raised);

      position: absolute;

      display: inline-flex;
      justify-content: flex-end;

      width: 100%;
      padding: var(--padding-card-tag);
      box-sizing: border-box;
    }

    .trakt-card-cover-badge {
      top: 0;
      left: 0;
    }

    .trakt-card-cover-tag {
      bottom: 0;
      left: 0;

      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-xxs);
    }

    &:not(.trakt-card-cover-placeholder) {
      :global(img) {
        object-position: top;
      }
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
