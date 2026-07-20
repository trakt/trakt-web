<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsSection from "./SettingsSection.svelte";

  const {
    title,
    description,
    crumb,
    action,
    variant,
    children,
  }: ChildrenProps & {
    title?: string;
    description?: string;
    crumb?: { href: string; label: string };
    action?: Snippet;
    variant?: "vip" | "muted";
  } = $props();
</script>

<SettingsSection {title} {description} {crumb} {action}>
  <div class="trakt-settings-group-card" data-variant={variant}>
    {@render children()}
  </div>
</SettingsSection>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-group-card {
    overflow: hidden;

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    &[data-variant="vip"] {
      @include vip-glow-card;
    }

    &[data-variant="muted"] {
      @include muted-card;
    }
  }
</style>
