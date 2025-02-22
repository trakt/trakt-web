<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UserList from "$lib/sections/lists/user/UserList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { mapToMediaType } from "./_internal/mapToMediaType";
  import { userListSummary } from "./userListSummary.ts";

  const { list } = $derived(
    userListSummary({
      userId: page.params.user,
      listId: page.params.list,
    }),
  );

  const type = $derived(mapToMediaType(page.url.searchParams));
  const listName = $derived($list?.name ?? "");
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={listName}>
  <TraktPageCoverSetter />

  <UserList
    title={listName}
    userId={page.params.user}
    listId={page.params.list}
    {type}
  />
</TraktPage>
