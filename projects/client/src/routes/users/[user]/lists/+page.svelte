<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartLists from "$lib/sections/lists/smart/SmartLists.svelte";
  import PersonalLists from "$lib/sections/lists/user/PersonalLists.svelte";
  import type { PersonalListType } from "$lib/sections/lists/user/models/PersonalListType.ts";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { mode } = useDiscover();
  const { user } = useUser();

  const { isMe } = $derived(useIsMe(params.user));

  const personalListTypes: PersonalListType[] = [
    "personal",
    "liked",
    "collaboration",
  ];
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
  filterScope="global"
>
  {#if !$isMe}
    <Redirect to={UrlBuilder.profile.user(params.user)} />
  {/if}

  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <WatchList
    drilldownLabel={m.button_label_view_all_watchlist_items()}
    type={$mode}
  />

  <SmartLists mode={$mode} />

  {#each personalListTypes as type (type)}
    <PersonalLists slug={$user.slug} {type} mode={$mode} display="compact" />
  {/each}
</TraktPage>
