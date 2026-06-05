<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery, useQuery } from "$lib/features/query/useQuery.ts";
  import { dataSyncsQuery } from "$lib/requests/queries/streaming-sync/dataSyncsQuery.ts";
  import { dataSyncsSummaryQuery } from "$lib/requests/queries/streaming-sync/dataSyncsSummaryQuery.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { firstValueFrom, map } from "rxjs";
  import SettingsBlock from "../SettingsBlock.svelte";
  import DataSyncRow from "./DataSyncRow.svelte";
  import { toServiceInfo } from "./toServiceInfo.ts";
  import { useStreamingServiceLookup } from "./useStreamingServiceLookup.ts";
  import { useStreamingSyncActions } from "./useStreamingSyncActions.ts";

  const SYNCS_PAGE_SIZE = 10;

  const actions = useStreamingSyncActions();
  const { lookup } = useStreamingServiceLookup();

  const query = useInfiniteQuery(dataSyncsQuery({ limit: SYNCS_PAGE_SIZE }));

  const syncs = query.pipe(
    map(
      (queryState) =>
        queryState.data?.pages.flatMap((page) => page.entries) ?? [],
    ),
  );
  const hasNextPage = query.pipe(
    map((queryState) => Boolean(queryState.hasNextPage)),
  );
  const isFetchingNextPage = query.pipe(
    map((queryState) => queryState.isFetchingNextPage),
  );
  const isLoading = query.pipe(map((queryState) => queryState.isLoading));

  const summary = useQuery(dataSyncsSummaryQuery()).pipe(
    map((queryState) => queryState.data),
  );

  const fetchNextPage = async () => {
    const queryState = await firstValueFrom(query);
    await queryState.fetchNextPage();
  };
</script>

<SettingsBlock
  title={m.header_data_syncs()}
  description={m.description_data_syncs()}
  boldTitle
>
  {#if $summary && $summary.count > 0 && $summary.latest}
    <div class="trakt-data-syncs-banner">
      <span class="banner-icon" aria-hidden="true">👾</span>
      <div class="banner-text">
        <p class="banner-line">
          {m.text_data_syncs_count_before()}
          <strong>{$summary.count}</strong>
          {m.text_data_syncs_count_after()}
        </p>
        <p class="banner-line subtle">
          {m.text_data_syncs_recent_before()}
          <strong>
            {toHumanDate(new Date(), $summary.latest.createdAt, getLocale())}
          </strong>
        </p>
      </div>
    </div>
  {/if}

  {#if !$isLoading && ($syncs ?? []).length === 0}
    <p class="secondary italic">{m.text_no_data_synced()}</p>
  {:else}
    <div class="trakt-data-syncs-list">
      {#each $syncs ?? [] as sync (sync.key)}
        <DataSyncRow
          {sync}
          service={toServiceInfo({
            serviceId: sync.source,
            application: sync.application,
            connections: $lookup,
          })}
          onUndo={actions.undo(sync.id)}
        />
      {/each}
    </div>

    {#if $hasNextPage}
      <Button
        size="small"
        variant="secondary"
        color="default"
        disabled={$isFetchingNextPage}
        label={m.button_text_load_more()}
        onclick={fetchNextPage}
      >
        {m.button_text_load_more()}
      </Button>
    {/if}
  {/if}
</SettingsBlock>

<style lang="scss">
  .trakt-data-syncs-banner {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-16) var(--ni-20);

    border-radius: var(--border-radius-l);
    background-image: linear-gradient(
      120deg,
      color-mix(
          in srgb,
          var(--color-link-active) 22%,
          var(--color-card-background)
        )
        0%,
      var(--color-card-background) 60%
    );
  }

  .banner-icon {
    flex-shrink: 0;

    font-size: var(--ni-28);
    line-height: 1;
  }

  .banner-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .banner-line {
    margin: 0;
  }

  .banner-line.subtle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .trakt-data-syncs-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
