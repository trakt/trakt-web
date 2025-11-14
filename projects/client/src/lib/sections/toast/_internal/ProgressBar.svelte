<script lang="ts">
  const { progress }: { progress: number } = $props();
</script>

<div class="trakt-progress-bar" style="--play-progress: {progress}%"></div>

<style>
  .trakt-progress-bar {
    --progress-bar-border-radius: var(--border-radius-m);

    width: 100%;
    height: var(--ni-8);

    border-radius: var(--progress-bar-border-radius);

    position: relative;
    display: flex;
    overflow: hidden;

    box-sizing: border-box;

    background-color: var(--color-toast-progress-bar-background);
    box-shadow: inset 0 0 0 var(--ni-1) var(--color-toast-progress-bar-shadow);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: var(--play-progress);
      background-color: var(--color-toast-progress-bar-progress);
      border-radius: var(--progress-bar-border-radius);
      transition: width var(--transition-increment) ease-in-out;
    }
  }
</style>
