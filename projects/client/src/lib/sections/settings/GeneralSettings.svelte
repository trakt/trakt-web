<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Appearance from "./_internal/Appearance.svelte";
  import Behavior from "./_internal/Behavior.svelte";
  import BlockedUsers from "./_internal/BlockedUsers.svelte";
  import Genres from "./_internal/Genres.svelte";
  import Profile from "./_internal/Profile.svelte";
  import SettingsMobileOverview from "./_internal/SettingsMobileOverview.svelte";
</script>

<div class="trakt-general-settings">
  <Profile />

  <RenderFor audience="authenticated" device={["mobile"]}>
    <SettingsMobileOverview />
  </RenderFor>
  <RenderFor
    audience="authenticated"
    device={["tablet-sm", "tablet-lg", "desktop"]}
  >
    <Behavior />
  </RenderFor>

  <Genres />
  <BlockedUsers />
  <Appearance />

  <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
    <LogoutButton />
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-general-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;

    @include for-tablet-sm-and-below {
      padding: 0;
    }
  }
</style>
