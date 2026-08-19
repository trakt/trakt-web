<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import type { PlexToggleSettingsProps } from "./PlexToggleSettingsProps.ts";

  const {
    title,
    description,
    isLoading,
    rows,
    onToggle,
  }: PlexToggleSettingsProps = $props();

  const skeletonRows = [{ tags: 4 }, { tags: 1 }, { tags: 1 }, { tags: 4 }];
</script>

<SettingsGroupCard {title} {description}>
  {#if isLoading}
    {#each skeletonRows as row, i (i)}
      <div class="skeleton-row">
        <div class="skeleton skeleton-icon"></div>
        <div class="skeleton skeleton-label"></div>
        <div class="skeleton-tags">
          {#each Array(row.tags) as _, j (j)}
            <div class="skeleton skeleton-tag"></div>
          {/each}
        </div>
      </div>
    {/each}
  {:else}
    {#each rows as row (row.mediaKind)}
      <SettingsGroupRow title={row.title} variant="custom">
        {#snippet icon()}{@render row.icon()}{/snippet}
        <div class="plex-toggle-tags">
          {#each row.chips as chip (chip.settingKey)}
            <Button
              size="tag"
              label={chip.ariaLabel}
              color={chip.isActive ? "purple" : "default"}
              onclick={() =>
              onToggle({
                mediaKind: row.mediaKind,
                settingKey: chip.settingKey,
                current: chip.isActive,
              })}
            >
              {chip.label}
            </Button>
          {/each}
        </div>
      </SettingsGroupRow>
    {/each}
  {/if}
</SettingsGroupCard>

<style>
  .plex-toggle-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
    justify-content: flex-end;
  }

  .skeleton-row {
    min-height: var(--ni-64);
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m);
  }

  .skeleton-tags {
    display: flex;
    gap: var(--gap-xs);
    margin-inline-start: auto;
  }

  .skeleton {
    background-color: color-mix(in srgb, var(--color-border) 80%, transparent);
    border-radius: var(--border-radius-s);
    animation: pulse calc(5 * var(--transition-increment)) ease-in-out infinite
      alternate;
  }

  .skeleton-icon {
    flex-shrink: 0;
    width: var(--ni-36);
    height: var(--ni-36);
    border-radius: var(--border-radius-m);
  }

  .skeleton-label {
    width: var(--ni-80);
    height: var(--ni-16);
  }

  .skeleton-tag {
    width: var(--ni-60);
    height: var(--ni-28);
    border-radius: var(--border-radius-s);
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton {
      animation: none;
    }
  }
</style>
