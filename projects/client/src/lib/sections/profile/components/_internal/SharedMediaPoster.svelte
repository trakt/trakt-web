<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SharedMediaPosterProps } from "./SharedMediaPosterProps.ts";
  import { useSharedMedia } from "./useSharedMedia.ts";

  const { id, type, isFavorite }: SharedMediaPosterProps = $props();

  const media = useSharedMedia(fromRune(() => ({ id, type })));
</script>

{#if $media}
    <div class="trakt-shared-media-poster">
      <Link href={UrlBuilder.media(type, $media.slug)} color="inherit">
        <CrossOriginImage
          src={$media.poster.url.medium}
          alt={$media.title}
          animate={false}
        />
      </Link>
      {#if isFavorite}
        <span
          class="badge"
          role="img"
          aria-label={m.match_drawer_breakdown_favorites()}
        >
          <FavoriteIcon size="small" />
        </span>
      {/if}
    </div>
{:else}
  <Skeleton width="100%" height="100%" radius="0" />
{/if}

<style lang="scss">
  .trakt-shared-media-poster {
    position: relative;
    width: 100%;
    height: 100%;

    :global(a) {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .badge {
    position: absolute;
    pointer-events: none;
    inset-block-start: var(--ni-6);
    inset-inline-end: var(--ni-6);

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);
    border-radius: 50%;

    color: var(--shade-10);

    @media (prefers-reduced-motion: no-preference) {
      animation: match-heart-pop 420ms cubic-bezier(0.34, 1.8, 0.5, 1) 1350ms
        backwards;
    }
    background: color-mix(in srgb, var(--shade-940) 82%, transparent);
    box-shadow:
      0 var(--ni-2) var(--ni-6)
        color-mix(in srgb, var(--shade-1000) 40%, transparent),
      inset 0 0 0 var(--ni-1)
        color-mix(in srgb, var(--shade-10) 16%, transparent);
  }

  @keyframes match-heart-pop {
    from {
      opacity: 0;
      transform: scale(0);
    }
  }
</style>
