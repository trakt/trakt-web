<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const {
    title,
    children,
    action,
  }: ChildrenProps & { title: string; action: Snippet } = $props();
</script>

<div class="trakt-large-settings-row">
  <SettingsRow {title} {action} />
  {@render children()}
</div>

<style>
  .trakt-large-settings-row {
    display: flex;
    flex-direction: column;

    gap: var(--gap-s);
  }
</style>
