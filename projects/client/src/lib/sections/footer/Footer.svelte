<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FooterContent from "./components/FooterContent.svelte";
  import FooterImage from "./components/FooterImage.svelte";
</script>

<footer class="trakt-footer">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <FooterImage />
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
      margin-top: var(--ni-60);
      height: auto;
    }
  }
</style>
