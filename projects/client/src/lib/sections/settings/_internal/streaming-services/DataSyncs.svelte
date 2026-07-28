<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery, useQuery } from "$lib/features/query/useQuery.ts";
  import { dataSyncsQuery } from "$lib/requests/queries/streaming-sync/dataSyncsQuery.ts";
  import { dataSyncsSummaryQuery } from "$lib/requests/queries/streaming-sync/dataSyncsSummaryQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { firstValueFrom, map } from "rxjs";
  import DataSyncList from "../DataSyncList.svelte";
  import DataSyncsBanner from "../DataSyncsBanner.svelte";
  import SettingsSection from "../SettingsSection.svelte";
  import { toServiceInfo } from "./toServiceInfo.ts";
  import { useStreamingServiceLookup } from "./useStreamingServiceLookup.ts";
  import { useStreamingServicesActions } from "./useStreamingServicesActions.ts";

  const SYNCS_PAGE_SIZE = 10;

  const actions = useStreamingServicesActions();
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

<SettingsSection
  title={m.header_data_syncs()}
  description={m.description_data_syncs()}
>
  {#if $summary && $summary.count > 0 && $summary.latest}
    <DataSyncsBanner
      count={$summary.count}
      latestAt={$summary.latest.createdAt}
    />
  {/if}

  {#if !$isLoading && ($syncs ?? []).length === 0}
    <p class="secondary italic">{m.text_no_data_synced()}</p>
  {:else}
    <DataSyncList
      syncs={$syncs ?? []}
      hasNextPage={$hasNextPage}
      isFetchingNextPage={$isFetchingNextPage}
      onLoadMore={fetchNextPage}
      getOnUndo={actions.undo}
      getService={(sync) =>
        toServiceInfo({
          serviceId: sync.source,
          application: sync.application,
          connections: $lookup,
        })}
      getHref={(sync) => UrlBuilder.settings.streamingServicesDetail(sync.id)}
    />
  {/if}
</SettingsSection>
