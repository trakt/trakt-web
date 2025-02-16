<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UserlistList from "$lib/sections/lists/userlist/UserlistList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { mapToMediaType } from "./_internal/mapToMediaType";
  import { useListSummary } from "./useListSummary";

  const { list } = useListSummary({
    userId: page.params.user,
    listId: page.params.list,
  });

  const type = $derived(mapToMediaType(page.url.searchParams));
  const listName = $derived($list?.name ?? "");
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={listName}>
  <TraktPageCoverSetter />

  <UserlistList
    title={listName}
    userId={page.params.user}
    listId={page.params.list}
    {type}
  />
</TraktPage>
