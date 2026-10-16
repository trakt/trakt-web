<script lang="ts">
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MixtapePickSlotProps } from "./MixtapePickSlotProps.ts";

  const { media, removeHref }: MixtapePickSlotProps = $props();
</script>

<div class="trakt-mixtape-pick-slot">
  {#if media}
    <CrossOriginImage
      classList="pick-poster"
      src={media.poster.url.thumb}
      alt={m.image_alt_media_poster({ title: media.title })}
    />
    <div class="pick-remove">
      <Link
        href={removeHref}
        noscroll
        replacestate
        color="inherit"
        label={m.button_label_mixtape_remove_pick({ title: media.title })}
      >
        <CloseIcon />
      </Link>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-pick-slot {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    animation: pick-slot-pop calc(2 * var(--transition-increment))
      cubic-bezier(0.34, 1.56, 0.64, 1);

    :global(.pick-poster) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pick-remove {
      position: absolute;
      inset-block-start: var(--ni-2);
      inset-inline-end: var(--ni-2);

      :global(.trakt-link) {
        display: grid;
        place-items: center;
        width: var(--mixtape-remove-size, var(--ni-28));
        height: var(--mixtape-remove-size, var(--ni-28));

        border-radius: 50%;
        background: color-mix(in srgb, var(--shade-940) 70%, transparent);
        color: var(--shade-10);
        text-decoration: none;
      }

      :global(.trakt-link)::before {
        content: "";
        position: absolute;
        inset: calc(-1 * var(--ni-8));
      }

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }
  }

  @keyframes pick-slot-pop {
    from {
      transform: scale(0.6);
      opacity: 0;
    }
  }
</style>
