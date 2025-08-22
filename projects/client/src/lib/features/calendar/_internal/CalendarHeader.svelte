<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CalendarControls from "./CalendarControls.svelte";
</script>

<div class="calendar-header">
  <h6>{m.header_calendar()}</h6>
  <CalendarControls />
</div>

<style>
  .calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: space-between;

    h6 {
      text-transform: none;
      margin-left: var(--ni-10);
    }
  }
</style>
