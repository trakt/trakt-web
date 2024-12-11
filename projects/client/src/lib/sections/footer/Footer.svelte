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

<style>
  .trakt-footer {
    height: var(--ni-300);
    margin-top: var(--ni-120);
    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);

    @media (max-width: 768px) {
      margin-top: var(--ni-60);
      height: auto;
    }
  }
</style>
