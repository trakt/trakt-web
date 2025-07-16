<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DangerZone from "./_internal/DangerZone.svelte";
  import Genres from "./_internal/Genres.svelte";
  import Profile from "./_internal/Profile.svelte";
  import Spoilers from "./_internal/Spoilers.svelte";
</script>

<div class="trakt-general-settings">
  <Profile />
  <Spoilers />
  <Genres />

  <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
    <DangerZone />
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
    padding: var(--ni-8);

    @include for-tablet-sm-and-below {
      padding: 0;
      max-width: 100%;
    }
  }
</style>
