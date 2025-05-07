<script lang="ts">
  import TraktCoverImage from "$lib/components/background/TraktCoverImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FooterContent from "./components/FooterContent.svelte";
</script>

<footer class="trakt-footer">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <TraktCoverImage />
  </RenderFor>
  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    height: var(--footer-height);
    margin-top: var(--ni-120);
    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      height: var(--footer-mobile-height);
    }
  }
</style>
