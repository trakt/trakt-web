<script lang="ts">
  import { createCalendarContext } from "./context/createCalendarContext";

  const { children }: ChildrenProps = $props();

  createCalendarContext();
</script>

{@render children()}
