<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Appearance from "./_internal/Appearance.svelte";
  import Behavior from "./_internal/Behavior.svelte";
  import Genres from "./_internal/Genres.svelte";
  import Profile from "./_internal/Profile.svelte";
</script>

<div class="trakt-general-settings">
  <Profile />
  <Behavior />
  <Genres />
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
    gap: var(--gap-xxl);

    min-width: 0;
    max-width: var(--ni-480);

    @include for-tablet-sm-and-below {
      padding: 0;
      max-width: 100%;
    }
  }
</style>
