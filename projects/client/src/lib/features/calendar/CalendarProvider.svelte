<script lang="ts">
  import { calendarDateParam } from "./_internal/calendarDateParam.ts";
  import { syncCalendarDateParam } from "./_internal/syncCalendarDateParam.ts";
  import { createCalendarContext } from "./context/createCalendarContext";

  const { children }: ChildrenProps = $props();

  const context = createCalendarContext(calendarDateParam().date);

  syncCalendarDateParam(context);
</script>

{@render children()}
