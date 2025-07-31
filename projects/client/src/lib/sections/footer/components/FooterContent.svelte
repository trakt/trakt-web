<script lang="ts">
  import { page } from "$app/state";
  import FeatureFlagTool from "$lib/features/feature-flag/FeatureFlagTool.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LogoutButton from "./_internal/LogoutButton.svelte";
  import CopyRight from "./CopyRight.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
  import FooterBar from "./FooterBar.svelte";
  import FooterLogo from "./FooterLogo.svelte";

  const isOnProfile = $derived(page.route.id === UrlBuilder.profile.me());
</script>

<div class="trakt-footer-content">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <FooterBar>
      <FooterLogo />
      {#if isOnProfile}
        <RenderFor navigation="dpad" audience="authenticated">
          <LogoutButton size="small" />
        </RenderFor>
      {/if}
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
      <FeatureFlagTool />
    </div>
    <div class="trakt-footer-right">
      <RenderFor audience="all" navigation="default">
        <ExternalLinks />
      </RenderFor>
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
