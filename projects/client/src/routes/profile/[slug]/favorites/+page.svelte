<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import FavoritesListPaginated from "$lib/sections/lists/favorites/FavoritesListPaginated.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { mode } = useDiscover();

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ type: "favorites", slug: params.slug }),
  );
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_favorites()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}

    {#snippet sortActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
      />
    {/snippet}
  </NavbarStateSetter>

  <FavoritesListPaginated
    slug={params.slug}
    title={m.list_title_favorites()}
    mode={$mode}
    sortBy={$current.sorting.value}
    sortHow={$current.sortHow}
  />
</TraktPage>
