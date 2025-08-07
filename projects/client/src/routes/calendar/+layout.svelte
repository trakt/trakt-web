<script lang="ts">
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";

  const { children } = $props();
</script>

<CalendarProvider>
  {@render children?.()}
</CalendarProvider>
