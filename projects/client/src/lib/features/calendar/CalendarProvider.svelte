<script lang="ts">
  import { untrack } from "svelte";
  import { createCalendarContext } from "./context/createCalendarContext";

  const {
    children,
    initialDate,
  }: ChildrenProps & { initialDate?: Date | Nil } = $props();

  createCalendarContext({ initialDate: untrack(() => initialDate) });
</script>

{@render children()}
