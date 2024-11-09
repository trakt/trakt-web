<script lang="ts">
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";
</script>

<div class="trakt-content">
  <ProfileBanner />
  <UpcomingSchedule />
</div>

<style>
  .trakt-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    inset: 0;
    margin: auto;
  }
</style>
