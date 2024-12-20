<script lang="ts">
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
</script>

<ProfileContainer>
  {#snippet details()}
    <ProfilePageBanner />
  {/snippet}

  <ProfileAbout />
</ProfileContainer>
