<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DataSync } from "$lib/requests/models/DataSync.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import StreamingServiceBadge from "./StreamingServiceBadge.svelte";
  import type { ServiceInfo } from "./toServiceInfo.ts";
  import { type SyncCountLabel, toSyncCountLabels } from "./toSyncCountLabels.ts";

  type DataSyncRowProps = {
    sync: DataSync;
    service?: ServiceInfo;
    onUndo: () => void;
  };

  const { sync, service, onUndo }: DataSyncRowProps = $props();

  const detailUrl = $derived(UrlBuilder.settings.streamingSyncDetail(sync.id));

  type Group = { key: string; label: string; pills: SyncCountLabel[] };

  const groups = $derived.by<Group[]>(() => {
    const sections: Group[] = [
      { key: "history", label: m.text_table_history(), pills: toSyncCountLabels(sync.items.history) },
      { key: "library", label: m.text_table_library(), pills: toSyncCountLabels(sync.items.library) },
      { key: "ratings", label: m.text_table_ratings(), pills: toSyncCountLabels(sync.items.ratings) },
      { key: "watchlist", label: m.text_table_watchlist(), pills: toSyncCountLabels(sync.items.watchlist) },
    ].filter((group) => group.pills.length > 0);

    return sections;
  });

  const flags = $derived.by<SyncCountLabel[]>(() => {
    const result: SyncCountLabel[] = [];
    if (sync.pausedCount > 0) {
      result.push({
        key: "paused",
        label: m.text_streaming_count_paused({ count: sync.pausedCount }),
      });
    }
    if (sync.skippedCount > 0) {
      result.push({
        key: "skipped",
        label: m.text_streaming_count_skipped({ count: sync.skippedCount }),
      });
    }
    return result;
  });

  const hasBreakdown = $derived(groups.length > 0 || flags.length > 0);
</script>

{#snippet pill(label: string, kind: "added" | "flag")}
  <Link href={detailUrl} color="inherit">
    <span class="pill" data-kind={kind}>{label}</span>
  </Link>
{/snippet}

<div class="trakt-data-sync-row" class:is-undone={sync.isUndone}>
  <div class="service">
    {#if service}
      <StreamingServiceBadge
        name={service.name}
        logoUrl={service.logoUrl}
        color={service.color}
        size="small"
      />
    {/if}
  </div>

  <div class="details">
    <Link href={detailUrl} color="inherit">
      <span class="date bold">
        {toHumanDate(new Date(), sync.createdAt, getLocale())}
      </span>
    </Link>

    {#if !sync.isUndone && hasBreakdown}
      <div class="groups">
        {#each groups as group (group.key)}
          <div class="group">
            <span class="group-label">{group.label}</span>
            <div class="group-pills">
              {#each group.pills as count (count.key)}
                {@render pill(count.label, "added")}
              {/each}
            </div>
          </div>
        {/each}

        {#if flags.length > 0}
          <div class="group">
            <div class="group-pills">
              {#each flags as flag (flag.key)}
                {@render pill(flag.label, "flag")}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="action">
    {#if sync.isUndone}
      <div class="undone-state">
        <span class="tag undone">{m.text_undone()}</span>
        {#if sync.undoneAt}
          <span class="undone-date secondary">
            {toHumanDate(new Date(), sync.undoneAt, getLocale())}
          </span>
        {/if}
      </div>
    {:else}
      <Button
        size="small"
        variant="secondary"
        color="default"
        label={m.button_text_undo()}
        onclick={onUndo}
      >
        {m.button_text_undo()}
      </Button>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-data-sync-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-12) var(--ni-16);

    border: var(--border-thickness-xs) solid transparent;
    border-radius: var(--border-radius-l);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    transition: border-color var(--transition-increment) ease-in-out;

    &:hover {
      border-color: var(--color-link-active);
    }

    &.is-undone {
      opacity: 0.6;
    }
  }

  .service {
    flex-shrink: 0;
  }

  .details {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .date {
    color: var(--color-text-primary);
  }

  .groups {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--ni-8);
  }

  .group {
    display: flex;
    align-items: baseline;
    gap: var(--ni-8);
  }

  .group-label {
    flex-shrink: 0;

    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
    text-transform: uppercase;
  }

  .group-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
  }

  .pill {
    display: inline-block;
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-s);

    font-size: var(--font-size-tag);
    white-space: nowrap;

    &[data-kind="added"] {
      background-color: color-mix(
        in srgb,
        var(--color-link-active) 14%,
        transparent
      );
      color: var(--color-link-active);
    }

    &[data-kind="flag"] {
      background-color: color-mix(
        in srgb,
        var(--color-text-secondary) 12%,
        transparent
      );
      color: var(--color-text-secondary);
    }
  }

  .action {
    flex-shrink: 0;
  }

  .undone-state {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--ni-2);
  }

  .undone-date {
    font-size: var(--font-size-tag);
    white-space: nowrap;
  }

  .trakt-data-sync-row :global(.trakt-link) {
    text-decoration: none;
  }

  span.tag.undone {
    display: inline-block;
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-s);

    background-color: color-mix(
      in srgb,
      var(--color-text-secondary) 12%,
      transparent
    );
    color: var(--color-text-secondary);

    font-size: var(--font-size-tag);
    text-transform: uppercase;
  }
</style>
