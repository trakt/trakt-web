<script lang="ts">
  import EditModeButton from "$lib/features/edit-mode/EditModeButton.svelte";
  import FeatureFlagTool from "$lib/features/feature-flag/FeatureFlagTool.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import AppearanceDrawer from "./AppearanceDrawer.svelte";

  const currentYear = new Date().getFullYear();
  const copyright = `© 2010-${currentYear} trakt, inc.`;
</script>

<div class="trakt-footer-copyright">
  <div class="trakt-copyright">
    <p class="secondary tag">
      {copyright}
      {m.text_copyright_notice()}
    </p>
    <div class="trakt-crafted-by">
      <p class="secondary tag">
        {m.text_copyright_crafted_by()}
      </p>
      <AppearanceDrawer />
    </div>
  </div>

  <EditModeButton />
  <FeatureFlagTool />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-copyright,
  .trakt-copyright,
  .trakt-crafted-by {
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
    @include for-mobile {
      flex-direction: column;
    }
  }

  .trakt-crafted-by {
    gap: var(--ni-2);
  }
</style>
