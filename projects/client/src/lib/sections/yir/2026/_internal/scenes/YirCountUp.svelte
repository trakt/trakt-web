<script lang="ts">
  import CountUp from "$lib/components/counter/CountUp.svelte";
  import { yirBeats } from "../persona/yirBeats";

  const {
    value,
    active,
    format,
    duration = yirBeats(14),
  }: {
    value: number;
    active: boolean;
    format: (value: number) => string;
    duration?: number;
  } = $props();
</script>

<CountUp {value} {active} {format} {duration} />
