<script>
  import CopyRight from "./CopyRight.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";

  import FooterBar from "./FooterBar.svelte";
  import FooterLogo from "./FooterLogo.svelte";
</script>

<div class="trakt-footer-content">
  <FooterBar>
    <FooterLogo />
  </FooterBar>
  <FooterBar>
    <CopyRight />
    <ExternalLinks />
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
