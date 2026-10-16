<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListActions from "$lib/sections/lists/smart/_internal/SmartListActions.svelte";
  import SmartListDrawer from "$lib/sections/lists/smart/_internal/SmartListDrawer.svelte";
  import SmartListRecipeLink from "$lib/sections/lists/smart/_internal/SmartListRecipeLink.svelte";
  import SmartListPaginatedRenderer from "$lib/sections/lists/smart/SmartListPaginatedRenderer.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { PageProps } from "./$types";
  import { useSmartListSummary } from "./useSmartListSummary.ts";

  const { params }: PageProps = $props();

  const listId$ = fromRune(() => params.list);
  const { list, isLoading } = useSmartListSummary(listId$);

  // FIXME: split up (or add support) for public smart lists
</script>

{#snippet recipe()}
  {#if $list}
    <SmartListRecipeLink list={$list} />
  {/if}
{/snippet}

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
      metaInfo: $list ? recipe : undefined,
      actions,
    }}
  />

  <TraktPageCoverSetter />

  {#if !$isLoading && !$list}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {:else if $list}
    <SmartListPaginatedRenderer list={$list} />
    <SmartListDrawer list={$list} />
  {/if}
</TraktPage>
