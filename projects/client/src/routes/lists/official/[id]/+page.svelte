<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import OfficialList from "$lib/sections/lists/official/OfficialList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { mapToMediaType } from "../../../users/[user]/lists/[list]/_internal/mapToMediaType";
  import { useListSummary } from "./useListSummary";

  const type = $derived(mapToMediaType(page.url.searchParams));

  const { list } = useListSummary({
    listId: page.params.id,
  });

  const listName = $derived($list?.name ?? "");
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={listName}>
  <TraktPageCoverSetter />

  <OfficialList title={listName} listId={page.params.id} {type} />
</TraktPage>
