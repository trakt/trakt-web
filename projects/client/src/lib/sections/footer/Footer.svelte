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
  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    height: var(--ni-256);

    margin-top: var(--gap-xxl);
    margin-left: var(--layout-sidebar-distance);

    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      &.has-toast {
        margin-top: calc(var(--height-toast-card) + var(--gap-xxl));
      }

      height: fit-content;
      position: relative;
    }
  }
</style>
