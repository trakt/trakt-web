<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListActions from "$lib/sections/lists/smart/_internal/SmartListActions.svelte";
  import { getSmartListFilterSummary } from "$lib/sections/lists/smart/getSmartListFilterSummary.ts";
  import SmartListPaginatedRenderer from "$lib/sections/lists/smart/SmartListPaginatedRenderer.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { PageProps } from "./$types";
  import { useSmartListSummary } from "./useSmartListSummary.ts";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useSmartListSummary({ listId: params.list }),
  );
</script>

{#snippet actions()}
  {#if $list}
    <SmartListActions list={$list} />
  {/if}
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={$list?.title || m.page_title_smart_lists()}
  hasDynamicContent={true}
>
  <NavbarStateSetter
    header={{
      title: $list?.title ?? "",
      metaInfo: $list ? getSmartListFilterSummary($list) : undefined,
      actions,
    }}
  />

  <TraktPageCoverSetter />

  {#if !$isLoading && !$list}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {:else if $list}
    <SmartListPaginatedRenderer list={$list} />
  {/if}
</TraktPage>
