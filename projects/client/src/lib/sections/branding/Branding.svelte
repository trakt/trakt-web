<script lang="ts">
  import BrandingLogos from "./components/BrandingLogos.svelte";
  import BrandingQuestions from "./components/BrandingQuestions.svelte";
  import BrandingRequirements from "./components/BrandingRequirements.svelte";
</script>

<div class="trakt-branding">
  <BrandingRequirements />
  <div class="trakt-branding-divider"></div>
  <BrandingLogos />
  <BrandingQuestions />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding {
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
