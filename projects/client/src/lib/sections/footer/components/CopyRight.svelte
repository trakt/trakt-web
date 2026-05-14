<script lang="ts">
  import FeatureFlagTool from "$lib/features/feature-flag/FeatureFlagTool.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const currentYear = new Date().getFullYear();
  const copyright = `© 2010-${currentYear} trakt, inc.`;
</script>

<div class="trakt-footer-copyright">
  <div class="trakt-copyright">
    <p class="secondary tag">
      {copyright}
      {m.text_copyright_notice()}
    </p>
    <p class="secondary tag">
      {m.text_copyright_crafted_by()}
    </p>
  </div>

  <FeatureFlagTool />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-copyright,
  .trakt-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-footer-copyright {
    :global(.trakt-action-button) {
      --button-size: var(--ni-32);
    }
  }

  .trakt-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--gap-xs);

    @include for-mobile {
      flex-direction: column;
    }
  }
</style>
