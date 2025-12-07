<script lang="ts">
  import { time } from "$lib/utils/timing/time";
  import { Confetti } from "svelte-confetti";

  const { position }: { position: { x: number; y: number } } = $props();
</script>

<div
  class="confetti-container"
  style="left: {position.x}px; top: {position.y}px;"
>
  <Confetti
    y={[-0.5, 0.5]}
    x={[-0.5, 0.5]}
    duration={time.seconds(2)}
    fallDistance="10px"
    colorArray={[
      'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOS45NzQ5NiA1LjI4MTdMMTQuNjU3NCA1LjgzNjg4TDExLjE5NTUgOS4wMzgzTDEyLjExNDUgMTMuNjYzMUw4IDExLjM2TDMuODg1NSAxMy42NjMxTDQuODA0NDUgOS4wMzgzTDEuMzQyNiA1LjgzNjg4TDYuMDI1MDQgNS4yODE3TDggMVoiIGZpbGw9IiNGRkMzMDAiIHN0cm9rZT0iI0ZGQzMwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49ImJldmVsIi8+PC9zdmc+")',
    ]}
  />
</div>

<style>
  .confetti-container {
    position: absolute;
  }
</style>
