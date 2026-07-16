<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import ListsCount from "$lib/sections/lists/components/ListsCount.svelte";
  import CreateSmartListButton from "$lib/sections/lists/smart/_internal/CreateSmartListButton.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import { useSmartLists } from "$lib/sections/lists/smart/useSmartLists.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const smartListsLimit = 100;

  const { mode, current: currentDiscoverMode } = useDiscover();

  // Mirrors the SmartListRenderer params below so both share query observers.
  const { count: smartListsCount } = $derived(
    useSmartLists({ mode: $mode, limit: smartListsLimit }),
  );

  /*
    FIXME: add a generic way to handle empty states in applicable pages,
    e.g. personal lists, watchlist, etc. (https://github.com/trakt/trakt-web/issues/2569)
  */
</script>

{#snippet headerActions()}
  <CreateSmartListButton />
{/snippet}

{#snippet listsMetaInfo()}
  <ListsCount
    count={$smartListsCount}
    metaText={$currentDiscoverMode.text()}
  />
{/snippet}

{#snippet empty()}
  <div class="trakt-smart-lists-page-empty">
    <CtaItem cta={{ type: "smart-list" }} variant="placeholder" />
  </div>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_smart_lists()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    header={{ title: m.list_title_smart_lists(), metaInfo: listsMetaInfo }}
    {headerActions}
  />

  <SmartListRenderer mode={$mode} limit={smartListsLimit} {empty} />
</TraktPage>

<style>
  .trakt-smart-lists-page-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
