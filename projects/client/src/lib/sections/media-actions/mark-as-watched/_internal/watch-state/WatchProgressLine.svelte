<script lang="ts">
  const {
    progress,
    tone = "muted",
    size = "regular",
  }: {
    progress: number;
    tone?: "lit" | "muted";
    size?: "regular" | "large";
  } = $props();
</script>

<span
  class="trakt-watch-progress-line"
  data-tone={tone}
  data-size={size}
  style:--watch-progress={`${Math.min(100, Math.max(0, progress))}%`}
  aria-hidden="true"
>
  <span class="line-fill"></span>
</span>

<style lang="scss">
  .trakt-watch-progress-line {
    --line-height: var(--ni-6);

    display: block;
    width: 100%;
    height: var(--line-height);

    border-radius: var(--border-radius-pill);
    background-color: var(--color-watch-state-track);

    &[data-size="large"] {
      --line-height: var(--ni-8);
    }
  }

  .line-fill {
    display: block;
    width: var(--watch-progress);
    height: 100%;

    border-radius: inherit;
    background-color: var(--color-watch-state-fill-done);

    transition: width var(--transition-duration-short) ease-out;

    [data-tone="lit"] > & {
      background-color: var(--color-watch-state-fill);
      box-shadow: var(--shadow-watch-state-fill);
    }
  }
</style>
