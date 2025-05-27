<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { isImageComplete } from "$lib/utils/image/isImageComplete";
  import { checksum } from "$lib/utils/string/checksum";
  import type { CardCoverProps } from "./CardCoverProps";

  const {
    src,
    overlaySrc,
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
  class:trakt-card-cover-youtube={src.includes("youtube")}
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
  <div
    class="trakt-card-cover-image"
    class:has-overlay={overlaySrc}
    class:has-gradient={style === "gradient"}
  >
    <CrossOriginImage
      classList="trakt-card-cover-image"
      animate={false}
      {src}
      {alt}
      onload={() => (isImagePending = false)}
      aria-labelledby={id}
    />
    {#if overlaySrc && !PLACEHOLDERS.includes(overlaySrc)}
      <CrossOriginImage
        classList="trakt-logo-overlay"
        animate={false}
        src={overlaySrc}
        {alt}
        onload={() => (isImagePending = false)}
        aria-labelledby={id}
      />
    {/if}

    {#if overlaySrc && PLACEHOLDERS.includes(overlaySrc)}
      <p class="trakt-logo-overlay">
        {title}
      </p>
    {/if}
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

    &:not(.trakt-card-cover-placeholder):not(.trakt-card-cover-youtube) {
      :global(img.trakt-card-cover-image) {
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

    :global(.trakt-logo-overlay) {
      position: absolute;
      bottom: 0;

      padding-bottom: var(--ni-8);

      z-index: var(--layer-raised);

      filter: drop-shadow(
        var(--ni-1) var(--ni-1) var(--ni-2) rgba(0, 0, 0, 0.25)
      );
    }

    :global(img.trakt-card-cover-image) {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    :global(img.trakt-logo-overlay) {
      --logo-width: 60%;

      width: var(--logo-width);
      height: 100%;

      position: absolute;
      bottom: 0;
      left: calc((100% - var(--logo-width)) / 2);

      object-fit: contain;
      object-position: bottom;
    }

    p.trakt-logo-overlay {
      width: 100%;

      color: var(--shade-20);

      text-align: center;
      text-transform: uppercase;
      font-weight: bold;

      padding: 8px;
      box-sizing: border-box;
    }

    &.has-overlay::after {
      content: "";

      position: absolute;
      bottom: 0;
      left: 0;

      width: 100%;
      height: 75%;

      background: linear-gradient(
        180deg,
        transparent 0%,
        var(--color-card-cover-shadow, var(--shade-900)) 100%
      );
    }
  }
</style>
