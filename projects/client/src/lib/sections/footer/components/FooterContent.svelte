<script>
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import CopyRight from "./CopyRight.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";

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
    <div class="trakt-footer-left">
      <RenderFor device={["tablet-lg", "desktop"]} audience="all">
        <CopyRight />
      </RenderFor>
      <LocalePicker />
      <ThemePicker />
    </div>
    <div class="trakt-footer-right">
      <ExternalLinks />
    </div>
  </FooterBar>
</div>

<style>
  .trakt-footer-content {
    height: 100%;
    position: relative;
    display: grid;
    align-content: space-between;
  }

  .trakt-footer-left,
  .trakt-footer-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
