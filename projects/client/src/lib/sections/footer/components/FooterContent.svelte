<script lang="ts">
  import { page } from "$app/state";
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CopyRight from "./CopyRight.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
  import FooterBar from "./FooterBar.svelte";
  import FooterLogo from "./FooterLogo.svelte";
  import PageLinks from "./PageLinks.svelte";

  const isOnProfile = $derived(page.route.id === UrlBuilder.profile.me());
</script>

<div class="trakt-footer-content">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <FooterBar>
      <FooterLogo />
      {#if isOnProfile}
        <RenderFor navigation="dpad" audience="authenticated">
          <LogoutButton />
        </RenderFor>
      {/if}
      <PageLinks />
    </FooterBar>

    <FooterBar>
      <div class="trakt-footer-left">
        <CopyRight />
      </div>
      <div class="trakt-footer-right">
        <RenderFor audience="all" navigation="default">
          <ExternalLinks />
        </RenderFor>
      </div>
    </FooterBar>
  </RenderFor>

  <RenderFor device={["tablet-sm", "mobile"]} audience="all">
    <FooterBar>
      <div class="trakt-footer-left">
        <CopyRight />
      </div>
      <div class="trakt-footer-right">
        <PageLinks />
      </div>
    </FooterBar>
    <FooterBar>
      <ExternalLinks />
    </FooterBar>
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-content {
    height: 100%;
    position: relative;
    display: grid;
    align-content: space-between;

    @include for-mobile {
      padding-bottom: var(--ni-8);
    }
  }

  .trakt-footer-left,
  .trakt-footer-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
