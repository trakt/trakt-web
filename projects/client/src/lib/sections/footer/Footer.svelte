<script lang="ts">
  import FooterContent from "./components/FooterContent.svelte";
  import { FOOTER_CLASS_NAME } from "./constants";

</script>

<footer class={FOOTER_CLASS_NAME}>
  <FooterContent />
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer {
    height: var(--ni-256);

    margin-top: calc(var(--floating-toast-height, 0px) + var(--gap-xxl));
    margin-inline-start: var(--layout-sidebar-distance);

    padding-inline-start: var(--layout-distance-side);
    padding-inline-end: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      margin-top: 0;
      margin-bottom: var(--gap-l);

      height: fit-content;
      position: relative;
    }
  }
</style>
