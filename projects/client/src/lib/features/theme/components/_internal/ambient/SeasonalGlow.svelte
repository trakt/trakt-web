<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  const { themeId }: { themeId: SeasonalThemeId } = $props();
</script>

<div class="trakt-seasonal-glow" data-season={themeId} aria-hidden="true"></div>

<style>
  .trakt-seasonal-glow {
    --glow: color-mix(in srgb, var(--purple-400) 22%, transparent);
    --night: color-mix(in srgb, var(--color-background-tint) 35%, transparent);

    position: fixed;
    inset: 0;

    pointer-events: none;
    z-index: var(--layer-background);

    &[data-season="halloween"] {
      background:
        radial-gradient(
          circle at 88% -4%,
          var(--glow) 0%,
          transparent min(36vw, var(--ni-480))
        ),
        linear-gradient(to top, var(--night) 0%, transparent 28%);
    }

    &[data-season="christmas"] {
      --glow-evergreen: color-mix(in srgb, var(--green-400) 14%, transparent);

      background:
        radial-gradient(
          ellipse at 12% -10%,
          var(--glow) 0%,
          transparent 45%
        ),
        radial-gradient(
          ellipse at 92% -10%,
          var(--glow-evergreen) 0%,
          transparent 40%
        );
    }

    &[data-season="new-year"] {
      background:
        radial-gradient(
          ellipse at 50% -20%,
          var(--glow) 0%,
          transparent 55%
        ),
        linear-gradient(to top, var(--night) 0%, transparent 30%);
    }
  }
</style>
