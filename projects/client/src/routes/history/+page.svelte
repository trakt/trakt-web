<script lang="ts">
  import { page } from "$app/state";
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { dataSyncQuery } from "$lib/requests/queries/streaming-sync/dataSyncQuery.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalHistoryPaginatedList from "$lib/sections/lists/history/PersonalHistoryPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
  import { toSyncSourceName } from "$lib/utils/formatting/string/toSyncSourceName.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { filter, map } from "rxjs";

  const { mode, current } = useDiscover();

  // Read off the URL, not the global parameter map, so it never sticks across
  // navigation.
  const syncId = $derived.by(() => {
    const raw = page.url.searchParams.get("sync_id");
    if (!raw) return undefined;

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  });

  const syncId$ = fromRune(() => syncId);
  const syncQuery = useQuery(
    syncId$.pipe(
      filter((id): id is number => id != null),
      map((id) => dataSyncQuery({ id })),
    ),
  );
  const syncSource = syncQuery.pipe(
    map((queryState) => queryState.data?.source),
  );

  const syncSourceName = $derived(
    $syncSource ? toSyncSourceName($syncSource) : undefined,
  );

  const syncMetaInfo = $derived.by(() => {
    if (syncId == null) return undefined;

    return syncSourceName == null
      ? m.text_history_sync_filter({ id: syncId })
      : m.text_history_sync_filter_with_source({
          id: syncId,
          source: syncSourceName,
        });
  });

  const header = $derived({
    title: m.list_title_history(),
    metaInfo: syncId == null ? $current.text() : syncMetaInfo,
    back: syncId == null ? undefined : {
      href: UrlBuilder.history.home(),
      label: m.link_label_history_all(),
    },
  });
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter hasFilters {header} />

  <CalendarProvider>
    <PersonalHistoryPaginatedList mode={$mode} {syncId} />
  </CalendarProvider>
</TraktPage>
