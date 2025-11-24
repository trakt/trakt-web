<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CalendarControls from "./CalendarControls.svelte";
</script>

<div class="calendar-header">
  <span class="title">{m.header_calendar()}</span>
  <CalendarControls />
</div>

<style>
  .calendar-header {
    height: var(--ni-40);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: space-between;

    span.title {
      margin-left: var(--ni-10);
    }
  }
</style>
