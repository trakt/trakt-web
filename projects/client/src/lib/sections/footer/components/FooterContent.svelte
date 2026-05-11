<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
  import FooterBar from "./FooterBar.svelte";
  import FooterLogo from "./FooterLogo.svelte";
  import PageLinks from "./PageLinks.svelte";
</script>

<div class="trakt-footer-content">
  <RenderFor device={["tablet-lg", "desktop"]} audience="all">
    <div class="trakt-footer-top">
      <div class="trakt-footer-left-col">
        <FooterLogo />
      </div>
      <div class="trakt-footer-center-col">
        <PageLinks />
      </div>
      <div class="trakt-footer-right-col">
        <RenderFor audience="all">
          <ExternalLinks />
        </RenderFor>
      </div>
    </div>
  </RenderFor>

  <RenderFor device={["tablet-sm", "mobile"]} audience="all">
    <div class="trakt-footer-mobile">
      <FooterBar>
        <FooterLogo />
      </FooterBar>
      <FooterBar>
        <PageLinks />
      </FooterBar>
      <FooterBar>
        <div class="trakt-footer-right">
          <ExternalLinks />
        </div>
      </FooterBar>
    </div>
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-content {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @include for-mobile {
      justify-content: space-between;
      padding-bottom: var(--ni-8);
    }
  }

  .trakt-footer-top {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--gap-s);
    padding: var(--footer-bar-padding);

    @include for-tablet-sm-and-below {
      padding: var(--ni-12);
      display: flex;
      flex-direction: column;
    }
  }

  .trakt-footer-mobile {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  .trakt-footer-left-col {
    display: flex;
    justify-content: flex-start;
  }

  .trakt-footer-center-col {
    display: flex;
    justify-content: center;
  }

  .trakt-footer-right-col {
    display: flex;
    justify-content: flex-end;
  }

  .trakt-footer-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }
</style>
