<script lang="ts">
  import BrandingClearSpace from "./components/BrandingClearSpace.svelte";
  import BrandingColors from "./components/BrandingColors.svelte";
  import BrandingLogos from "./components/BrandingLogos.svelte";
  import BrandingQuestions from "./components/BrandingQuestions.svelte";
  import BrandingRequirements from "./components/BrandingRequirements.svelte";

  let logos = $state<{ downloadAll: () => Promise<void> }>();
</script>

<div class="trakt-branding">
  <BrandingRequirements onDownloadKit={() => logos?.downloadAll()} />
  <BrandingClearSpace />
  <div class="trakt-branding-divider"></div>
  <BrandingLogos bind:this={logos} />
  <BrandingColors />
  <BrandingQuestions />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding {
    --branding-white: #ffffff;
    --branding-ink: #111111;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    align-self: center;
    max-width: var(--ni-1280);
    width: 100%;
    box-sizing: border-box;

    padding: 0 var(--layout-distance-side);

    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-xl);
    }
  }

  .trakt-branding-divider {
    width: 100%;
    height: var(--border-thickness-xxs);
    background: color-mix(in srgb, var(--color-border) 60%, transparent);
    border-radius: var(--border-radius-xs);
  }
</style>
