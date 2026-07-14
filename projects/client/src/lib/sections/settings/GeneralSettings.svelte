<script lang="ts">
  import GeneralSettingsBody from "./GeneralSettingsBody.svelte";
  import Profile from "./_internal/Profile.svelte";
</script>

<div class="trakt-general-settings">
  <Profile />
  <GeneralSettingsBody />
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
