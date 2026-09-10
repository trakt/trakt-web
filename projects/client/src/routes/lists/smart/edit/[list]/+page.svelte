<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import SmartListCreator from "$lib/sections/smart-lists/SmartListCreator.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";
  import { useSmartListSummary } from "../../view/[list]/useSmartListSummary.ts";

  const { params }: PageProps = $props();

  const { mode } = useDiscover();
  const { limits } = useUser();

  const { list, isLoading } = $derived(
    useSmartListSummary({ listId: params.list }),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_edit_list()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter mode="minimal" hasFilters />

  {#if !$isLoading && !$list}
    <Redirect to={UrlBuilder.lists.smart.all()} />
  {:else if $list && $limits}
    <SmartListCreator mode={$mode} limits={$limits} list={$list} />
  {/if}
</TraktPage>
