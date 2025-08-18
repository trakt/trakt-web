<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DangerZone from "./_internal/DangerZone.svelte";
  import Genres from "./_internal/Genres.svelte";
  import Profile from "./_internal/Profile.svelte";
  import Spoilers from "./_internal/Spoilers.svelte";
</script>

<!-- FIXME: make settings page dpad navigate-able -->
<RenderFor audience="authenticated">
  <div class="trakt-settings">
    <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
      <div class="trakt-settings-sidebar">
        <div class="trakt-settings-sidebar-content">
          <h4>{m.header_settings()}</h4>
        </div>
        <DangerZone />
      </div>
    </RenderFor>
    <div class="trakt-settings-content">
      <Profile />
      <Spoilers />
      <Genres />

      <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
        <DangerZone />
      </RenderFor>
    </div>
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings {
    display: grid;
    grid-template-columns: var(--ni-300) 1fr;
    gap: var(--gap-xxl);

    margin: 0 var(--layout-distance-side);

    min-height: var(--ni-120);

    transition: var(--transition-increment) ease-in-out;
    transition-property: grid-template-columns, gap;

    :global(.trakt-action-button) {
      &:not(:hover) {
        background-color: transparent;
      }
    }

    .trakt-settings-content {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxl);

      min-width: 0;
      max-width: var(--ni-480);
      padding: var(--ni-8);
    }

    @include for-tablet-lg {
      grid-template-columns: var(--ni-220) 1fr;
      gap: var(--gap-l);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;

      .trakt-settings-content {
        padding: 0;
        max-width: 100%;
      }
    }
  }

  .trakt-settings-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-s);
  }
</style>
