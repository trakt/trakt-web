<script lang="ts">
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { time } from "$lib/utils/timing/time";
  import { onMount } from "svelte";

  const { endDate }: { endDate: Date } = $props();

  const endDateText = $derived(writable(toHumanETA(new Date(), endDate)));

  const getIntervalDelay = (): number => {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= time.minutes(5)) {
      return time.seconds(10);
    }

    if (difference <= time.hours(1)) {
      return time.minutes(1);
    }

    return time.hours(1);
  };

  onMount(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const updateRemainingTime = () => {
      endDateText.set(toHumanETA(new Date(), endDate));
      clearInterval(intervalId);
      intervalId = setInterval(updateRemainingTime, getIntervalDelay());
    };

    updateRemainingTime();

    return () => clearInterval(intervalId);
  });
</script>

<p class="tag no-wrap uppercase">
  Deal ends {$endDateText}
</p>
