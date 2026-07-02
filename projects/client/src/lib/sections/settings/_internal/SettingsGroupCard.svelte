<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsSection from "./SettingsSection.svelte";

  const {
    title,
    description,
    crumb,
    action,
    children,
  }: ChildrenProps & {
    title?: string;
    description?: string;
    crumb?: { href: string; label: string };
    action?: Snippet;
  } = $props();
</script>

<SettingsSection {title} {description} {crumb} {action}>
  <div class="trakt-settings-group-card">
    {@render children()}
  </div>
</SettingsSection>

<style lang="scss">
  .trakt-settings-group-card {
    overflow: hidden;

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }
  }
</style>
