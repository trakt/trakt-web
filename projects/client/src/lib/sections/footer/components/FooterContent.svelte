<script>
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import CopyRight from "./CopyRight.svelte";
  import FooterActions from "./FooterActions.svelte";

  import FooterBar from "./FooterBar.svelte";
  import FooterLogo from "./FooterLogo.svelte";
</script>

<div class="trakt-footer-content">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <FooterBar>
      <FooterLogo />
    </FooterBar>
  </RenderFor>

  <FooterBar>
    <!-- TODO: different layout for smaller (or different component for only theme/lang pickers) -->
    <RenderFor device={["tablet-lg", "desktop"]} audience="all">
      <CopyRight />
    </RenderFor>
    <FooterActions />
  </FooterBar>
</div>

<style>
  .trakt-footer-content {
    height: 100%;
    position: relative;
    display: grid;
    align-content: space-between;
  }
</style>
