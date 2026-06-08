<script lang="ts">
  import CopyRight from "./CopyRight.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
  import FooterLogo from "./FooterLogo.svelte";
  import PageLinks from "./PageLinks.svelte";
</script>

<div class="trakt-footer-content">
  <div class="trakt-footer-grid">
    <div class="trakt-footer-left-col">
      <FooterLogo />
    </div>

    <div class="trakt-footer-center-col">
      <PageLinks />
    </div>

    <div class="trakt-footer-right-col">
      <ExternalLinks />
    </div>
  </div>

  <CopyRight />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-content {
    height: 100%;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    box-sizing: border-box;
    padding-top: var(--footer-bar-padding);

    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-l);
    }
  }

  .trakt-footer-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;

    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      display: flex;
      flex-direction: column;
    }
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
</style>
