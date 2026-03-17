<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";
  import { mapToMediaType } from "./_internal/mapToMediaType";

  const { params }: PageProps = $props();

  const { list } = $derived(
    useUserListSummary({
      userId: params.user,
      listId: params.list,
    }),
  );

  const type = $derived(mapToMediaType(page.url.searchParams));
  const listName = $derived($list?.name ?? "");
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <NavbarStateSetter hasFilters />

  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList title={listName} list={$list} {type} />
  {/if}
</TraktPage>
