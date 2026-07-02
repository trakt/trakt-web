<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useTrendingItems } from "$lib/sections/landing/useTrendingItems.ts";

  const POSTER_COUNT = 6;

  const { list } = useTrendingItems("movie");

  const posters = $derived(
    $list.map((item) => item.poster.url.medium).slice(0, POSTER_COUNT),
  );
</script>

<div class="trakt-welcome-backdrop" aria-hidden="true">
  <div class="backdrop-posters">
    {#each posters as poster, index (poster)}
      <div class="backdrop-poster" style="--i: {index}">
        <CrossOriginImage src={poster} alt="" />
      </div>
    {/each}
  </div>
  <div class="backdrop-veil"></div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;

    overflow: hidden;
    pointer-events: none;
  }

  .backdrop-veil {
    position: absolute;
    inset: 0;

    background:
      radial-gradient(
        100% 75% at 50% 118%,
        color-mix(in srgb, var(--purple-500) 15%, transparent) 0%,
        color-mix(in srgb, var(--purple-500) 10%, transparent) 40%,
        color-mix(in srgb, var(--purple-500) 5%, transparent) 66%,
        transparent 85%
      ),
      radial-gradient(
        120% 100% at 50% 42%,
        color-mix(in srgb, var(--color-background) 15%, transparent),
        color-mix(in srgb, var(--color-background) 82%, transparent)
      );
  }

  .backdrop-posters {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: min(100%, var(--ni-1280));

    -webkit-mask-image: linear-gradient(
      90deg,
      #000 0 30%,
      transparent 42% 58%,
      #000 70% 100%
    );
    mask-image: linear-gradient(
      90deg,
      #000 0 30%,
      transparent 42% 58%,
      #000 70% 100%
    );
  }

  .backdrop-poster {
    position: absolute;

    width: var(--ni-144);

    animation: backdrop-drift 15s ease-in-out infinite;
    animation-delay: calc(var(--i) * -2.5s);

    :global(img) {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 2 / 3;
      object-fit: cover;

      border-radius: var(--border-radius-l);
      box-shadow:
        0 var(--ni-24) var(--ni-56)
          color-mix(in srgb, var(--color-background) 60%, transparent),
        0 0 0 var(--border-thickness-xxs)
          color-mix(in srgb, var(--color-foreground) 6%, transparent);
    }

    &:nth-child(1) {
      inset-block-start: 6%;
      inset-inline-start: 5%;
    }
    &:nth-child(1) :global(img) {
      transform: rotate(-5deg);
    }
    &:nth-child(2) {
      inset-block-start: 40%;
      inset-inline-start: 11%;
    }
    &:nth-child(2) :global(img) {
      transform: rotate(3deg);
    }
    &:nth-child(3) {
      inset-block-start: 73%;
      inset-inline-start: 2%;
    }
    &:nth-child(3) :global(img) {
      transform: rotate(-3deg);
    }

    &:nth-child(4) {
      inset-block-start: 7%;
      inset-inline-end: 5%;
    }
    &:nth-child(4) :global(img) {
      transform: rotate(4deg);
    }
    &:nth-child(5) {
      inset-block-start: 41%;
      inset-inline-end: 11%;
    }
    &:nth-child(5) :global(img) {
      transform: rotate(-3deg);
    }
    &:nth-child(6) {
      inset-block-start: 73%;
      inset-inline-end: 2%;
    }
    &:nth-child(6) :global(img) {
      transform: rotate(2deg);
    }

    :global(img.image-loaded) {
      opacity: 0.25;
      filter: blur(2px);
    }
  }

  @keyframes backdrop-drift {
    0%,
    100% {
      transform: translateY(calc(-1 * var(--ni-12)));
    }
    50% {
      transform: translateY(var(--ni-12));
    }
  }

  @include for-mobile {
    .backdrop-posters {
      width: 100%;
      opacity: 0.6;

      -webkit-mask-image: none;
      mask-image: none;
    }

    .backdrop-poster {
      width: var(--ni-104);

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        inset-inline-start: -10%;
      }

      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        inset-inline-end: -10%;
      }
    }

    .backdrop-veil {
      background:
        radial-gradient(
          120% 55% at 50% 0%,
          color-mix(in srgb, var(--purple-500) 8%, transparent) 0%,
          transparent 60%
        ),
        radial-gradient(
          130% 55% at 50% 100%,
          color-mix(in srgb, var(--purple-500) 12%, transparent) 0%,
          transparent 65%
        );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop-poster {
      animation: none;
    }
  }
</style>
