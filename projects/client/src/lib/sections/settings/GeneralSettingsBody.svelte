<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import AppearanceSettings from "./AppearanceSettings.svelte";
  import Behavior from "./_internal/Behavior.svelte";
  import BlockedUsers from "./_internal/BlockedUsers.svelte";
  import Genres from "./_internal/Genres.svelte";
</script>

<div class="trakt-general-settings-body">
  <Behavior />
  <Genres />
  <BlockedUsers />
  <AppearanceSettings />

  <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
    <LogoutButton />
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-general-settings-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;

    @include for-tablet-sm-and-below {
      padding: 0;
    }
  }
</style>
