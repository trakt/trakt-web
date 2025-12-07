<script lang="ts">
  import { time } from "$lib/utils/timing/time";
  import { Confetti } from "svelte-confetti";
</script>

<div class="confetti-container">
  <Confetti
    y={[0, 0.5]}
    x={[-1, 2]}
    delay={[time.seconds(1), time.seconds(0.25)]}
    fallDistance="10px"
    rounded
    colorArray={["var(--shade-200)", "var(--purple-600)", "var(--red-400)"]}
  />
</div>

<style>
  .confetti-container {
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>
