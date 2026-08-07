<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import type { PersonBackdropVariant } from "./PersonBackdropVariant.ts";

  /*
    Three candidate treatments for what sits behind a person, since a person has no
    artwork of their own to fall back on.

    - `credit`   the 16:9 fanart of the film they are best known for. Real artwork,
                 thematically theirs, and closest to the media masthead's feel.
                 Depends on their credits having any.
    - `headshot` their own headshot, scaled up and blurred. Always available and
                 never fails, but it is the same image twice.
    - `colors`   a wash in the palette of that same top credit. No image weight and
                 no risk of competing with the portrait, but the least atmospheric.

    All three dissolve through the shared mask rather than an overlay, so none of
    them can end on a hard edge - see _backdropDissolve.
  */
  const {
    variant,
    person,
    media,
  }: {
    variant: PersonBackdropVariant;
    person: PersonSummary;
    media: MediaEntry | null;
  } = $props();

  const colors = $derived(media?.colors);
</script>

{#if variant === "credit" && media}
  <div class="trakt-person-backdrop" data-variant="credit" aria-hidden="true">
    <CrossOriginImage src={media.cover.url.medium} alt="" />
  </div>
{/if}

{#if variant === "headshot"}
  <div class="trakt-person-backdrop" data-variant="headshot" aria-hidden="true">
    <CrossOriginImage src={person.headshot.url.medium} alt="" />
  </div>
{/if}

{#if variant === "colors" && colors}
  <div
    class="trakt-person-backdrop"
    data-variant="colors"
    aria-hidden="true"
    style="--backdrop-color-one: {colors[0]}; --backdrop-color-two: {colors[1]}"
  ></div>
{/if}

<style lang="scss">
  @use "../../header-kit/backdropDissolve" as dissolve;

  .trakt-person-backdrop {
    position: absolute;
    inset-inline: 0;
    top: 0;
    /*
      Deep enough to sit behind the portrait and the name, which is where the
      atmosphere is wanted. Below that the dissolve has already finished.
    */
    height: var(--person-backdrop-height, var(--ni-480));

    /* Behind the header's content, above the page. */
    z-index: -1;

    overflow: hidden;
    pointer-events: none;

    @include dissolve.backdrop-dissolve;

    :global(img) {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center var(--backdrop-focus, 30%);
    }
  }

  /*
    The headshot is a portrait standing in for a landscape band, so it has to be
    blown well past its own size to fill the width. Blurring hides the resulting
    softness and, more importantly, stops it competing with the sharp copy of
    itself sitting directly on top.
  */
  .trakt-person-backdrop[data-variant="headshot"] {
    :global(img) {
      transform: scale(1.6);
      filter: blur(var(--ni-40)) saturate(1.2);
    }
  }

  .trakt-person-backdrop[data-variant="colors"] {
    background: radial-gradient(
      120% 100% at 50% 0%,
      var(--backdrop-color-one) 0%,
      var(--backdrop-color-two) 55%,
      transparent 100%
    );
  }
</style>
