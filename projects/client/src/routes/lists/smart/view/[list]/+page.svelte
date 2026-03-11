<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListPaginatedRenderer from "$lib/sections/lists/smart/SmartListPaginatedRenderer.svelte";
  import { useSmartLists } from "$lib/sections/lists/smart/useSmartLists.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import {
    DEFAULT_SHARE_COVER,
    UPPER_SMART_LIST_LIMIT,
  } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { list: collection } = useSmartLists({
    mode: "media",
    limit: UPPER_SMART_LIST_LIMIT,
  });

  const listId = $derived(Number(params.list));
  const list = $derived($collection?.find((list) => list.id === listId));
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={list?.title || m.page_title_smart_lists()}
  hasDynamicContent={true}
>
  <NavbarStateSetter mode="minimal" />

  <TraktPageCoverSetter />

  {#if isNaN(listId) || !list}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {:else}
    <SmartListPaginatedRenderer {list} />
  {/if}
</TraktPage>
