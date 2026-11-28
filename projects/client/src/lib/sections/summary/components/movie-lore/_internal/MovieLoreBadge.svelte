<script lang="ts">
  type MovieLoreBadgeTone = "required" | "helpful" | "not_needed" | "caught_up" | "to_go";

  const { tone, children }: ChildrenProps & { tone: MovieLoreBadgeTone } =
    $props();
</script>

<span class="trakt-movie-lore-badge small bold" data-tone={tone}>
  {@render children()}
</span>

<style lang="scss">
  .trakt-movie-lore-badge {
    padding: var(--ni-2) var(--ni-10);
    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
    color: var(--color-text-primary);

    &[data-tone="required"] {
      background: var(--color-reality-altered-background);
      color: var(--color-reality-altered-text);
    }

    &[data-tone="helpful"] {
      background: var(--color-reality-adjusted-background);
      color: var(--color-reality-adjusted-text);
    }

    &[data-tone="not_needed"],
    &[data-tone="caught_up"] {
      background: var(--color-reality-accurate-background);
      color: var(--color-reality-accurate-text);
    }
  }
</style>
