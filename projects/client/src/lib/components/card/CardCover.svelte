<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { isImageComplete } from "$lib/utils/image/isImageComplete";
  import { checksum } from "$lib/utils/string/checksum";
  import { writable } from "svelte/store";
  import { lineClamp } from "../text/lineClamp";
  import type { CardCoverProps } from "./CardCoverProps";

  const { src, overlaySrc, alt, badge, tag, title }: CardCoverProps = $props();

  const isImagePending = $derived(writable(!isImageComplete(src)));
  const id = $derived(checksum(`${src}-${title}`));

  const isPlaceholder = $derived(PLACEHOLDERS.includes(src));
</script>

<div
  class="trakt-card-cover"
  class:trakt-card-cover-loading={$isImagePending}
  class:trakt-card-cover-placeholder={isPlaceholder}
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
    class:has-overlay={overlaySrc || isPlaceholder}
  >
    <CrossOriginImage
      classList="trakt-card-cover-image"
      animate={false}
      {src}
      {alt}
      onload={() => ($isImagePending = false)}
      aria-labelledby={id}
    />
    {#if overlaySrc && !PLACEHOLDERS.includes(overlaySrc)}
      <CrossOriginImage
        classList="trakt-logo-overlay"
        animate={false}
        src={overlaySrc}
        {alt}
        onload={() => ($isImagePending = false)}
        aria-labelledby={id}
      />
    {/if}

    {#if (overlaySrc && PLACEHOLDERS.includes(overlaySrc)) || isPlaceholder}
      <div class="trakt-title-overlay" class:has-tag={tag}>
        <p class="uppercase" use:lineClamp={{ lines: 3 }}>
          {title}
        </p>
      </div>
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

    &.trakt-card-cover-placeholder {
      /* FIXME: use SVG placeholders and remove this */
      .trakt-card-cover-image {
        :global(img.trakt-card-cover-image) {
          object-fit: contain;
        }
      }
    }

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

      justify-content: flex-start;
      gap: var(--gap-xxs);

      :global(.trakt-tag) {
        height: var(--ni-20);
        box-sizing: border-box;
      }
    }

    &:not(.trakt-card-cover-placeholder):not(.trakt-card-cover-youtube) {
      :global(img.trakt-card-cover-image) {
        object-position: top;
      }
    }
  }

  .trakt-card-cover-image {
    position: relative;
    height: var(--height-override-card-cover, var(--height-card-cover));
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

    .trakt-title-overlay {
      z-index: var(--layer-raised);
      width: 100%;

      position: absolute;
      bottom: 0;
      left: 0;

      color: var(--color-overlay-foreground);
      text-align: center;

      padding: var(--ni-8);
      box-sizing: border-box;

      p {
        font-weight: bold;
        text-overflow: ellipsis;
      }

      &.has-tag {
        bottom: var(--ni-24);
      }
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
        var(--color-card-cover-shadow, var(--shade-940)) 100%
      );
    }
  }
</style>
