<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Genres from "./_internal/Genres.svelte";
  import Profile from "./_internal/Profile.svelte";
  import Spoilers from "./_internal/Spoilers.svelte";
</script>

<!-- FIXME: make settings page dpad navigate-able -->
<RenderFor audience="authenticated">
  <div class="trakt-settings">
    <div class="trakt-settings-sidebar">
      <div class="trakt-settings-sidebar-content">
        <h4>{m.header_settings()}</h4>
      </div>
      <div class="trakt-settings-footer">
        <LogoutButton />
      </div>
    </div>
    <div class="trakt-settings-content">
      <Profile />
      <Spoilers />
      <Genres />
    </div>
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings {
    display: grid;
    grid-template-columns: var(--ni-300) 1fr;
    gap: var(--gap-s);

    margin: 0 var(--layout-distance-side);

    min-height: var(--ni-120);

    .trakt-settings-content {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxl);

      max-width: var(--ni-640);
      min-width: 0;
      padding: var(--ni-8);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;

      .trakt-settings-content {
        padding: 0;
      }
    }
  }

  .trakt-settings-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-s);

    h4 {
      transition: font-size var(--transition-increment) ease-in-out;
    }

    @include for-tablet-sm-and-below {
      flex-direction: row;
      align-items: center;
      height: fit-content;

      h4 {
        font-size: var(--ni-24);
      }
    }
  }
</style>
