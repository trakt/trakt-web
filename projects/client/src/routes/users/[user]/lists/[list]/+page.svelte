<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import type { PageProps } from "./$types";
  import { mapToMediaType } from "./_internal/mapToMediaType";
  import { userListSummary } from "./userListSummary.ts";

  const { params }: PageProps = $props();

  const { list } = $derived(
    userListSummary({
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
  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList title={listName} list={$list} {type} />
  {/if}
</TraktPage>
