<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeUrlOverride } from "$lib/sections/lists/components/models/EpisodeUrlOverride";

  /*
    What the rail is hiding, docked to the edge of the still nearest it: the
    count of episodes before the first card, or after the last one.

    It replaces a whole card that spent an episode slot saying "+7 more" - the
    slot is worth more as a seventh episode, and the number reads just as well
    as a half-pill on the frame. Same glass as the duration chip beside it, so
    it sits on any artwork.
  */
  const {
    side,
    count,
    link,
  }: {
    side: "start" | "end";
    count: number;
    link: EpisodeUrlOverride;
  } = $props();

  const label = $derived(
    side === "start"
      ? m.button_label_earlier_episodes({ count })
      : m.button_label_later_episodes({ count }),
  );

  /* A minus for what is behind, a plus for what is ahead - the sign is the
     direction, so the number never has to be read twice. */
  const sign = $derived(side === "start" ? "−" : "+");
</script>

<div class="trakt-episode-rail-edge-badge" data-side={side} data-cover-edge>
  <Link
    href={link.href}
    noscroll={link.noscroll}
    replacestate={link.replacestate}
    color="inherit"
    {label}
  >
    <span class="badge-count bold"><bdi dir="ltr">{sign}{count}</bdi></span>
    <span class="badge-label uppercase">{m.text_episodes_short()}</span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-episode-rail-edge-badge {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    z-index: var(--layer-raised);

    /*
      A pixel past the frame so no hairline of artwork shows between the badge
      and the edge; the cover clips, so the overhang never appears.
    */
    &[data-side="start"] {
      inset-inline-start: calc(-1 * var(--ni-1));
    }

    &[data-side="end"] {
      inset-inline-end: calc(-1 * var(--ni-1));
    }

    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      /* Comfortably past the 44px target floor on its own. */
      width: var(--ni-56);
      height: var(--ni-56);
      box-sizing: border-box;

      /*
        Black glass rather than a theme surface, like the duration chip: the
        badge sits on artwork, which is neither light nor dark on request.
      */
      background: var(--color-background-cover-tag);
      backdrop-filter: blur(var(--ni-6));
      color: var(--shade-10);

      transition: background-color var(--transition-increment) ease-in-out;
    }

    /* Half a pill, opening towards the episodes it stands for. */
    &[data-side="start"] :global(.trakt-link) {
      border-start-end-radius: 999px;
      border-end-end-radius: 999px;
    }

    &[data-side="end"] :global(.trakt-link) {
      border-start-start-radius: 999px;
      border-end-start-radius: 999px;
    }

    @include for-mouse {
      :global(.trakt-link:hover) {
        background: var(--color-background-cover-tag-hover);
      }
    }
  }

  .badge-count {
    font-size: var(--font-size-text);
    line-height: 1;
  }

  .badge-label {
    /* The tag size rather than the reference's 8px: it is the smallest the
       type scale names, and a size off the scale is one nobody can match. */
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--shade-10) 70%, transparent);
  }
</style>
