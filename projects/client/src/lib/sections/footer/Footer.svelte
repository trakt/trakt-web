<script lang="ts">
  import FooterContent from "./components/FooterContent.svelte";
  import FooterImage from "./components/FooterImage.svelte";
</script>

<footer class="trakt-footer">
  <FooterImage />
  <FooterContent />
</footer>

<style>
  .trakt-footer {
    height: var(--ni-300);
    margin-top: var(--ni-120);
    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    /* TODO: remove when RenderFor re-render is fixed */
    @media (max-width: 768px) {
      display: none;
    }
  }
</style>
