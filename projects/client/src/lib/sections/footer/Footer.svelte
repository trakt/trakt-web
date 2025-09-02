<script lang="ts">
  import TraktCoverImage from "$lib/components/background/TraktCoverImage.svelte";
  import { useNowPlaying } from "$lib/features/now-playing/useNowPlaying";
  import FooterContent from "./components/FooterContent.svelte";
  import { FOOTER_CLASS_NAME } from "./constants";

  const { nowPlaying } = useNowPlaying();
</script>

<footer class={FOOTER_CLASS_NAME} class:has-now-playing={$nowPlaying !== null}>
  <TraktCoverImage />
  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    height: var(--ni-300);

    margin-top: var(--gap-xxl);
    margin-left: var(--layout-sidebar-distance);

    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    :global(.trakt-cover-image) {
      width: calc(
        100dvw - 2 *
          var(--layout-distance-side) - var(--layout-sidebar-distance)
      );
    }

    @include for-tablet-sm-and-below {
      &.has-now-playing {
        margin-top: calc(var(--height-now-playing-card) + var(--gap-xxl));
      }

      height: fit-content;
      position: relative;
    }
  }
</style>
