<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SettingsNavbar from "./_internal/SettingsNavbar.svelte";

  const { children }: ChildrenProps = $props();
</script>

<!-- FIXME: make settings page dpad navigate-able -->
<RenderFor audience="authenticated">
  <div class="trakt-settings">
    <SettingsNavbar />
    <div class="trakt-settings-content">
      {@render children()}
    </div>
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings {
    display: grid;
    grid-template-columns: var(--ni-240) 1fr;
    gap: var(--gap-xxl);

    margin: 0 var(--layout-distance-side);

    transition: var(--transition-increment) ease-in-out;
    transition-property: grid-template-columns, gap;

    :global(.trakt-action-button) {
      &:not(:hover) {
        background-color: transparent;
      }
    }

    @include for-tablet-lg {
      grid-template-columns: var(--ni-220) 1fr;
      gap: var(--gap-l);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: var(--gap-l);
    }
  }
</style>
