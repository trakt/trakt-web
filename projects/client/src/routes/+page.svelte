<script lang="ts">
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import type { PageData } from "./$types";

  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";

  export let data: PageData;
</script>

<div class="trakt-content">
  <div class="trakt-theme-selector">
    <ThemePicker theme={data.theme} />
  </div>

  <UpcomingSchedule />
</div>

<style>
  .trakt-content {
    width: 60vw;
    min-width: 150px;
    inset: 0;
    margin: auto;
    margin-top: 5em;
  }

  .trakt-theme-selector {
    position: fixed;
    top: 1em;
    right: 1em;
  }
</style>
