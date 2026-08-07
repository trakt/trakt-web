<script lang="ts">
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import FooterContent from "./components/FooterContent.svelte";
  import { FOOTER_CLASS_NAME } from "./constants";

  const { nowPlaying } = useNowPlaying();
  const { lastWatched } = useLastWatched();

  const hasToast = $derived(Boolean($nowPlaying || $lastWatched));
</script>

<footer class={FOOTER_CLASS_NAME} class:has-toast={hasToast}>
  <!--
    The surface the footer sits on. Purely decorative, so it is hidden from
    assistive tech and sits behind the content rather than wrapping it - the
    footer's own layout is untouched.
  -->
  <div class="footer-plinth" aria-hidden="true"></div>

  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    /*
      How far the arch rises from its outer edges to its peak. This is the whole
      look - flatten it towards 0 and the plinth becomes the plain rectangle this
      exists to avoid.
    */
    --footer-plinth-depth: var(--ni-72);
    /* Peak level with the footer's top edge - see the plinth's `top`. */
    --footer-plinth-peak: var(--ni-0);

    height: var(--ni-256);

    margin-top: var(--gap-xxl);
    margin-inline-start: var(--layout-sidebar-distance);

    padding-inline-start: var(--layout-distance-side);
    padding-inline-end: var(--layout-distance-side);

    /* Anchors the plinth. */
    position: relative;
    /* Content sits on the plinth, not under it. */
    isolation: isolate;

    &.has-toast {
      margin-top: calc(var(--height-toast-card) + var(--gap-xxl));
    }

    @include for-tablet-sm-and-below {
      &.has-toast {
        margin-top: 0;
      }

      margin-top: 0;
      margin-bottom: var(--gap-l);

      height: fit-content;

      /*
        Shallower here, and for a structural reason: there is no top margin at this
        width, so a deeper arch would rise past the footer and sit behind the
        section above it. At this depth the peak stops exactly at the footer's top
        edge.
      */
      --footer-plinth-depth: var(--ni-40);
    }
  }

  .footer-plinth {
    position: absolute;
    z-index: -1;

    /*
      Full-bleed, by cancelling the footer's own start margin rather than by
      centring a 100dvw box on it. The footer is pushed in by the side navbar, so a
      viewport-width box centred on the footer sits off-centre by half that
      distance - which is what left a strip of page showing down the left. Insets
      pin the plinth to the window's own edges instead, and being logical they
      mirror for RTL, where the navbar moves to the other side.
    */
    inset-inline-start: calc(-1 * var(--layout-sidebar-distance));
    inset-inline-end: 0;

    /*
      Where the arch's peak sits relative to the footer's top edge: 0 is level with
      it, negative lifts it up into the margin above, positive pushes it further
      down into the footer. The outer edges fall a further --footer-plinth-depth
      below this, and the footer's content begins --footer-bar-padding down, which
      is the room the arch has to play in before content stops resting on it.
    */
    top: var(--footer-plinth-peak);
    /* Past the page's end, so overscroll never reveals a seam beneath it. */
    bottom: calc(-1 * var(--gap-xxl));

    background: var(--color-footer-plinth);

    /*
      The arch. Two quarter-ellipses, each half the width wide and the depth tall,
      meet at the centre to form one continuous curve that peaks in the middle and
      falls away to both edges - the same elliptical curvature the summary
      masthead's backdrop dissolve uses, inverted to bulge upwards.
    */
    border-start-start-radius: 50% var(--footer-plinth-depth);
    border-start-end-radius: 50% var(--footer-plinth-depth);

    pointer-events: none;
  }
</style>
