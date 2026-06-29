<script lang="ts">
  import { page } from "$app/state";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextPaginatedList from "$lib/sections/lists/progress/UpNextPaginatedList.svelte";
  import { useUpNextSorting } from "$lib/sections/lists/progress/useUpNextSorting";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();

  const {
    current: currentSort,
    update,
    options,
    urlBuilder,
  } = useUpNextSorting(page.params.user ?? "me");
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_up_next()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{ title: m.list_title_up_next(), metaInfo: $current.text() }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$currentSort}
        onUpdate={update}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <UpNextPaginatedList
    sortBy={$currentSort.sorting?.value}
    sortHow={$currentSort.sortHow}
  />
</TraktPage>
