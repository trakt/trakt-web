<script lang="ts">
  import TraktCoverImage from "$lib/components/background/TraktCoverImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FooterContent from "./components/FooterContent.svelte";
  import { FOOTER_CLASS_NAME } from "./constants";
</script>

<footer class={FOOTER_CLASS_NAME}>
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <TraktCoverImage />
  </RenderFor>
  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    height: var(--ni-300);
    margin-top: var(--ni-120);
    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      height: fit-content;
    }
  }
</style>
